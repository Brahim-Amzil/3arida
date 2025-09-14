// Prisma import removed as it was unused

type ApiError = {
  code: number;
  message: string;
  values: { [key: string]: string };
};

export type ApiResponse<T = unknown> =
  | {
      data: T;
      error: never;
    }
  | {
      data: never;
      error: ApiError;
    };

export type AppEvent =
  | 'user.password.updated'
  | 'user.password.request'
  | 'user.updated'
  | 'user.signup'
  | 'user.password.reset';

export type AUTH_PROVIDER =
  | 'github'
  | 'google'
  | 'saml'
  | 'email'
  | 'credentials'
  | 'idp-initiated';
