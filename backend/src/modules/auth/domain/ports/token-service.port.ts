export interface TokenPayload {
  sub: string;
  email: string;
}

export interface TokenServicePort {
  sign(payload: TokenPayload): string;
  verify(token: string): TokenPayload;
}
