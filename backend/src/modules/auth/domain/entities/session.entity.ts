export class Session {
  constructor(
    readonly sessionId: string,
    readonly userId: string,
    readonly email: string,
    readonly role: string,
    readonly createdAt: string,
    readonly expiresAt: string,
    readonly ip?: string,
    readonly userAgent?: string,
  ) {}

  isExpired(): boolean {
    return Date.now() > new Date(this.expiresAt).getTime();
  }
}
