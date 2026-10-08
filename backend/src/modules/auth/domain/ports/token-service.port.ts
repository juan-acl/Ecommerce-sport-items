export interface TokenPayload {
  sub: string; // sessionId — the only field; role/email come from the session in DB
}

export interface TokenServicePort {
  sign(payload: TokenPayload): string;
  verify(token: string): TokenPayload;
}
