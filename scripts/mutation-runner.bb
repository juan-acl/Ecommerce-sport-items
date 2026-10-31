#!/usr/bin/env bb
;; Gherkin mutation runner adapter for the sports-cart TypeScript project.
;; Usage: bb scripts/mutation-runner.bb <feature-slug>
;;
;; Reads newline-delimited mutation job requests from stdin (from gherkin-mutator),
;; regenerates and runs the affected acceptance test, and writes results to stdout.

(require '[cheshire.core :as json]
         '[clojure.java.io :as io]
         '[clojure.java.shell :refer [sh]])

(def FEATURE-MAP
  {"audit-advanced-search"        {:steps "../steps/audit-advanced-search.steps"        :fn "registerAuditSteps"}
   "order-status-email"           {:steps "../steps/order-status-email.steps"           :fn "registerOrderEmailSteps"}
   "audit-api-params"             {:steps "../steps/audit-api-params.steps"             :fn "registerAuditApiParamsSteps"}
   "audit-search-ui"              {:steps "../steps/audit-search-ui.steps"              :fn "registerAuditSearchUiSteps"}
   "reports-purchases-api"        {:steps "../steps/reports-purchases-api.steps"        :fn "registerReportsPurchasesApiSteps"}
   "reports-client-analytics-api" {:steps "../steps/reports-client-analytics-api.steps" :fn "registerReportsClientAnalyticsApiSteps"}
   "reports-date-range-api"       {:steps "../steps/reports-date-range-api.steps"       :fn "registerReportsDateRangeApiSteps"}
   "reports-purchases-ui"         {:steps "../steps/reports-purchases-ui.steps"         :fn "registerReportsPurchasesUiSteps"}
   "reports-client-analytics-ui"  {:steps "../steps/reports-client-analytics-ui.steps"  :fn "registerReportsClientAnalyticsUiSteps"}
   "reports-products-api"         {:steps "../steps/reports-products-api.steps"         :fn "registerReportsProductsApiSteps"}
   "reports-products-ui"          {:steps "../steps/reports-products-ui.steps"          :fn "registerReportsProductsUiSteps"}
   "discounts-no-approval"        {:steps "../steps/discounts-no-approval.steps"        :fn "registerDiscountsNoApprovalSteps"}
   "discounts-no-approval-ui"     {:steps "../steps/discounts-no-approval-ui.steps"     :fn "registerDiscountsNoApprovalUiSteps"}
   "discounts-client-coupon-api"  {:steps "../steps/discounts-client-coupon-api.steps"  :fn "registerDiscountsClientCouponApiSteps"}
   "discounts-client-coupon-ui"   {:steps "../steps/discounts-client-coupon-ui.steps"   :fn "registerDiscountsClientCouponUiSteps"}
   "discounts-special-coupon-api" {:steps "../steps/discounts-special-coupon-api.steps" :fn "registerDiscountsSpecialCouponApiSteps"}
   "discounts-special-coupon-ui"  {:steps "../steps/discounts-special-coupon-ui.steps"  :fn "registerDiscountsSpecialCouponUiSteps"}
   "dashboard-charts-ui"          {:steps "../steps/dashboard-charts-ui.steps"          :fn "registerDashboardChartsUiSteps"}
   "reports-inventory-chart-ui"   {:steps "../steps/reports-inventory-chart-ui.steps"   :fn "registerReportsInventoryChartUiSteps"}
   "reports-sales-chart-ui"       {:steps "../steps/reports-sales-chart-ui.steps"       :fn "registerReportsSalesChartUiSteps"}})

(defn- project-root []
  (-> *file* io/file .getParentFile .getParentFile .getCanonicalPath))

(defn- run-job [root feature-slug job]
  (let [start     (System/currentTimeMillis)
        config    (get FEATURE-MAP feature-slug)
        mut-id    (get job "id")
        feat-json (get job "feature_json")
        gen-dir   (str root "/backend/tests/acceptance/generated")
        gen-test  (str gen-dir "/" feature-slug "-mut-" mut-id ".acceptance.test.ts")
        ts-node   (str root "/backend/node_modules/.bin/ts-node")
        jest      (str root "/backend/node_modules/.bin/jest")
        gen       (sh ts-node
                      (str root "/scripts/generate-acceptance.ts")
                      feat-json gen-test (:steps config) (:fn config)
                      :dir root)
        outcome   (if (not= 0 (:exit gen))
                    "infrastructure_error"
                    (let [r (sh jest gen-test "--no-coverage" "--forceExit"
                                :dir (str root "/backend"))]
                      (if (zero? (:exit r)) "test_success" "test_failure")))
        duration  (- (System/currentTimeMillis) start)
        out-text  (str (:out gen "") (:out {} ""))
        err-text  (str (:err gen "") (:err {} ""))]
    (try (io/delete-file gen-test true) (catch Exception _))
    {:id mut-id :outcome outcome :output out-text :error err-text :duration duration}))

(let [feature-slug (first *command-line-args*)
      root         (project-root)]
  (when-not (get FEATURE-MAP feature-slug)
    (binding [*out* *err*]
      (println (str "mutation-runner: unknown feature slug: " feature-slug)))
    (System/exit 2))
  (doseq [line (line-seq (io/reader *in*))]
    (when (seq (clojure.string/trim line))
      (let [job    (json/parse-string line)
            result (try (run-job root feature-slug job)
                        (catch Exception e
                          {:id (get job "id") :outcome "infrastructure_error"
                           :output "" :error (ex-message e) :duration 0}))]
        (println (json/generate-string result))
        (flush)))))
