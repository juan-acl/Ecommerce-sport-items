import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { ImagePlus, X } from "lucide-react";
import type { Product } from "@shared/types/common";
import {
  useCreateProductMutation,
  useUpdateProductMutation,
  useGetUploadUrlMutation,
} from "@features/products/api/productsApi";
import { Modal } from "@shared/components/ui/Modal";
import { Button } from "@shared/components/ui/Button";
import { Input } from "@shared/components/ui/Input";

const CATEGORY_VALUES = [
  "running",
  "football",
  "basketball",
  "tennis",
  "swimming",
  "cycling",
  "fitness",
  "other",
] as const;

const productSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(150, "El nombre no puede exceder 150 caracteres")
    .regex(
      /^[\p{L}\p{N}\s.,\-'/()+]+$/u,
      "Solo puede contener letras, números, espacios y signos básicos",
    )
    .refine(
      (val) => /\p{L}/u.test(val),
      "El nombre debe contener al menos una letra (ej: Zapatos Running, Talla 42)",
    ),
  category: z.enum(CATEGORY_VALUES, {
    errorMap: () => ({ message: "Selecciona una categoría válida" }),
  }),
  price: z
    .number('El precio debe ser un número')
    .positive("El precio debe ser mayor a 0")
    .max(999999.99, "El precio no puede exceder Q999,999.99"),
  stock: z
    .number('El stock debe ser un número')
    .int('El stock debe ser un número entero')
    .min(0, "El stock no puede ser negativo")
    .max(99999, "El stock no puede exceder 99,999"),
  minStock: z
    .number('El stock mínimo debe ser un número')
    .int('El stock mínimo debe ser un número entero')
    .min(0, "El stock mínimo no puede ser negativo")
    .max(99999, "El stock mínimo no puede exceder 99,999"),
  description: z
    .string()
    .trim()
    .min(10, "La descripción debe tener al menos 10 caracteres")
    .max(1000, "La descripción no puede exceder 1000 caracteres")
    .regex(/^[^<>{}@]+$/, "La descripción contiene caracteres no permitidos (@, <, >, etc.)")
    .refine(
      (val) => /\p{L}/u.test(val),
      "La descripción debe contener texto descriptivo, no solo números",
    ),
  imageUrl: z.string().url("URL de imagen inválida").or(z.literal("")),
}).refine(
  (data) => data.minStock <= data.stock,
  {
    message: "El stock mínimo no puede ser mayor al stock actual",
    path: ["minStock"],
  },
);

type ProductFormData = z.infer<typeof productSchema>;


const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product | null;
}

export function ProductFormModal({
  isOpen,
  onClose,
  product,
}: Readonly<ProductFormModalProps>) {
  const isEditing = !!product;
  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const [getUploadUrl] = useGetUploadUrlMutation();

  // File kept in memory — only uploaded to S3 on form submit
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  // URL shown in the preview zone (objectURL while pending, or existing product URL)
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const objectUrlRef = useRef<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
  });

  const revokeObjectUrl = () => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
  };

  useEffect(() => {
    if (!isOpen) {
      revokeObjectUrl();
      setPendingFile(null);
      setPreviewSrc(null);
      return;
    }
    if (product) {
      reset({
        name: product.name,
        category: product.category,
        price: product.price,
        stock: product.stock,
        minStock: product.minStock,
        description: product.description,
        imageUrl: product.imageUrl,
      });
      setPreviewSrc(product.imageUrl || null);
    } else {
      reset({
        name: "",
        category: "",
        price: 0,
        stock: 0,
        minStock: 0,
        description: "",
        imageUrl: "",
      });
      setPreviewSrc(null);
    }
    revokeObjectUrl();
    setPendingFile(null);
  }, [isOpen, product, reset]);

  useEffect(() => () => revokeObjectUrl(), []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ACCEPTED_TYPES.includes(file.type)) {
      toast.error("Solo se aceptan imágenes JPG, PNG, WebP o GIF.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("La imagen no puede superar los 5 MB.");
      return;
    }

    revokeObjectUrl();
    const objectUrl = URL.createObjectURL(file);
    objectUrlRef.current = objectUrl;
    setPendingFile(file);
    setPreviewSrc(objectUrl);

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const clearImage = () => {
    revokeObjectUrl();
    setPendingFile(null);
    setPreviewSrc(null);
    setValue("imageUrl", "", { shouldValidate: true });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const onSubmit = async (data: ProductFormData) => {
    let finalImageUrl = data.imageUrl;

    if (pendingFile) {
      setIsUploading(true);
      try {
        const { uploadUrl, publicUrl } = await getUploadUrl({
          filename: pendingFile.name,
          contentType: pendingFile.type,
        }).unwrap();

        await fetch(uploadUrl, {
          method: "PUT",
          headers: { "Content-Type": pendingFile.type },
          body: pendingFile,
        });

        finalImageUrl = publicUrl;
      } catch {
        toast.error("Error al subir la imagen. Intenta de nuevo.");
        setIsUploading(false);
        return;
      }
      setIsUploading(false);
    }

    try {
      if (isEditing && product) {
        await updateProduct({
          id: product.id,
          ...data,
          imageUrl: finalImageUrl,
        }).unwrap();
        toast.success("Producto actualizado.");
      } else {
        await createProduct({ ...data, imageUrl: finalImageUrl }).unwrap();
        toast.success("Producto creado.");
      }
      onClose();
    } catch {
      toast.error("Error al guardar el producto.");
    }
  };

  const isLoading = isCreating || isUpdating || isUploading;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? "Editar producto" : "Nuevo producto"}
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit(onSubmit)} isLoading={isLoading}>
            {isEditing ? "Guardar cambios" : "Crear producto"}
          </Button>
        </>
      }
    >
      <form className="space-y-4" noValidate>
        {/* Image zone */}
        <div className="space-y-unit-sm">
          <label className="block text-label-md text-on-surface-variant">
            Imagen del producto
          </label>

          {previewSrc ? (
            <div className="relative w-full h-44 rounded-xl border border-outline-variant bg-surface-container/40 overflow-hidden">
              <img
                src={previewSrc}
                alt="Preview"
                className="w-full h-full object-contain p-2"
              />
              <div className="absolute top-2 right-2 flex gap-1.5">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-2.5 py-1 rounded-lg bg-white shadow-card text-label-sm text-on-surface-variant hover:text-primary transition-colors"
                >
                  Cambiar
                </button>
                <button
                  type="button"
                  onClick={clearImage}
                  className="p-1.5 rounded-lg bg-white shadow-card text-on-surface-variant hover:text-error transition-colors"
                  aria-label="Eliminar imagen"
                >
                  <X size={14} />
                </button>
              </div>
              {pendingFile && (
                <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/50 text-white text-label-sm">
                  Se subirá al guardar
                </span>
              )}
            </div>
          ) : (
            <div
              className="w-full h-44 rounded-xl border-2 border-dashed border-outline-variant bg-surface-container/40 flex flex-col items-center justify-center gap-2 text-on-surface-variant cursor-pointer transition-colors hover:border-primary hover:bg-primary-container/60 hover:text-primary"
              onClick={() => fileInputRef.current?.click()}
            >
              <ImagePlus size={28} />
              <p className="text-body-sm font-medium">
                Haz clic para seleccionar una imagen
              </p>
              <p className="text-label-sm">JPG, PNG, WebP, GIF · máx. 5 MB</p>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            onChange={handleFileChange}
          />

          {!previewSrc && (
            <Input
              {...register("imageUrl")}
              id="imageUrl"
              label="O pega una URL de imagen"
              placeholder="https://..."
              error={errors.imageUrl?.message}
            />
          )}
        </div>

        <Input
          {...register("name")}
          id="name"
          label="Nombre"
          placeholder="Ej: Zapatillas Running Pro"
          maxLength={150}
          error={errors.name?.message}
        />

        <div className="space-y-unit-sm">
          <label
            htmlFor="category"
            className="block text-label-md text-on-surface-variant"
          >
            Categoría
          </label>
          <select
            {...register("category")}
            id="category"
            className="w-full h-10 px-3 bg-white border border-outline-variant rounded-md outline-none transition-colors hover:border-outline/60 focus:ring-[3px] focus:ring-[#006b58]/10 focus:border-primary text-body-md text-on-surface capitalize"
          >
            <option value="">Seleccionar categoría</option>
            {CATEGORY_VALUES.map((cat) => (
              <option key={cat} value={cat} className="capitalize">
                {cat}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="text-label-md text-error px-1">
              {errors.category.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            {...register("price", { valueAsNumber: true })}
            id="price"
            type="number"
            step="0.01"
            min="0.01"
            max="999999.99"
            label="Precio (GTQ)"
            placeholder="0.00"
            error={errors.price?.message}
          />
          <Input
            {...register("stock", { valueAsNumber: true })}
            id="stock"
            type="number"
            min="0"
            max="99999"
            label="Stock"
            placeholder="0"
            error={errors.stock?.message}
          />
        </div>

        <Input
          {...register("minStock", { valueAsNumber: true })}
          id="minStock"
          type="number"
          min="0"
          max="99999"
          label="Stock mínimo"
          placeholder="0"
          error={errors.minStock?.message}
        />

        <div className="space-y-unit-sm">
          <label
            htmlFor="description"
            className="block text-label-md text-on-surface-variant"
          >
            Descripción
          </label>
          <textarea
            {...register("description")}
            id="description"
            rows={3}
            maxLength={1000}
            placeholder="Descripción del producto..."
            className="w-full py-2.5 px-3 bg-white border border-outline-variant rounded-md outline-none transition-colors hover:border-outline/60 focus:ring-[3px] focus:ring-[#006b58]/10 focus:border-primary text-body-md text-on-surface placeholder:text-outline resize-none"
          />
          {errors.description && (
            <p className="text-label-md text-error px-1">
              {errors.description.message}
            </p>
          )}
        </div>
      </form>
    </Modal>
  );
}
