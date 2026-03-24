import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';

export interface RedisClientLike {
  connect(): Promise<void>;
  quit(): Promise<void>;
  get(key: string): Promise<string | null>;
  set(
    key: string,
    value: string,
    options?: { EX?: number; PX?: number; NX?: boolean },
  ): Promise<string | null>;
  del(key: string): Promise<number>;
}

@Injectable()
export class RedisConnector implements OnModuleDestroy {
  private readonly logger = new Logger(RedisConnector.name);
  private client: RedisClientLike | null = null;

  async getClient(): Promise<RedisClientLike> {
    if (this.client) {
      return this.client;
    }

    const { createClient } = await import('redis');
    const host = process.env.REDIS_HOST ?? '127.0.0.1';
    const port = Number(process.env.REDIS_PORT ?? '6379');
    const username = process.env.REDIS_USERNAME;
    const password = process.env.REDIS_PASSWORD;
    const db = Number(process.env.REDIS_DB ?? '0');

    const client = createClient({
      socket: {
        host,
        port,
      },
      username,
      password,
      database: db,
    });

    client.on('error', (error: unknown) => {
      this.logger.error('Redis client error', error);
    });

    await client.connect();
    this.client = client as unknown as RedisClientLike;

    this.logger.log(`Redis connected at ${host}:${port}, db=${db}`);

    return this.client;
  }

  async onModuleDestroy(): Promise<void> {
    if (!this.client) {
      return;
    }

    await this.client.quit();
    this.client = null;
  }
}
