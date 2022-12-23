export class PatchUserDatabaseMetricsDto {
  readonly uuid: string;
  readonly size?: number;
  readonly queries?: number;
  readonly uptime?: number;
}
