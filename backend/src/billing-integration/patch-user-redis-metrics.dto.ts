export class PatchUserRedisMetricsDto {
  readonly userId: string;
  readonly redis_size?: number;
  readonly redis_queries?: number;
}
