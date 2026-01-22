import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import type {} from "multer";
import { MinioModule } from "nestjs-minio-client";

import { Config } from "../config/schema";
import { StorageController } from "./storage.controller";
import { StorageService } from "./storage.service";

@Module({
  imports: [
    MinioModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService<Config>) => {
        let endpoint = configService.getOrThrow<string>("STORAGE_ENDPOINT");
        const port = configService.getOrThrow<number>("STORAGE_PORT");
        const useSSL = configService.getOrThrow<boolean>("STORAGE_USE_SSL");
        
        // For Supabase Storage S3, the endpoint should be just the hostname
        // The Minio client will construct URLs, but Supabase S3 needs the /storage/v1/s3 path
        // We'll handle this by using just the hostname and letting Minio construct the base URL
        if (endpoint.includes("supabase.co")) {
          // Extract just the hostname (remove any path)
          endpoint = endpoint.split("/")[0];
        }
        
        return {
          endPoint: endpoint,
          port: port,
          region: configService.get<string>("STORAGE_REGION"),
          accessKey: configService.getOrThrow<string>("STORAGE_ACCESS_KEY"),
          secretKey: configService.getOrThrow<string>("STORAGE_SECRET_KEY"),
          useSSL: useSSL,
        };
      },
    }),
  ],
  controllers: [StorageController],
  providers: [StorageService],
  exports: [StorageService],
})
export class StorageModule {}
