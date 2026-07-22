type TokenKind = "access" | "refresh";

export type TokenPayload = {
  sub: string;
  email: string;
  kind: TokenKind;
  jti?: string;
};