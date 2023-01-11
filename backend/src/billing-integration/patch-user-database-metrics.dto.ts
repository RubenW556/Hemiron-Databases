export class PatchUserDatabaseMetricsDto {
  readonly userId: string;
  readonly postgres_size?: number;
  readonly postgres_queries?: number;
}
