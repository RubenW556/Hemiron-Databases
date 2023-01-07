export class PatchUserDatabaseMetricsDto {
  readonly userId: string;
  readonly size?: number;
  readonly queries?: number;
}
