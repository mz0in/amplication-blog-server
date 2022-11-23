import { Injectable } from "@nestjs/common";
import { Prisma, Post } from "@prisma/client";
import { PrismaService } from "nestjs-prisma";
import slugify from "slugify";
import { PostServiceBase } from "./base/post.service.base";
import { SLUGGIFY_OPTIONS } from "../constants";

@Injectable()
export class PostService extends PostServiceBase {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma);
  }

  async create<T extends Prisma.PostCreateArgs>(
    args: Prisma.SelectSubset<T, Prisma.TagCreateArgs>
  ): Promise<Post> {
    args.data.slug = slugify(args.data.title ?? '', SLUGGIFY_OPTIONS);
    return super.create<T>(args);
  }

  async update<T extends Prisma.PostUpdateArgs>(
    args: Prisma.SelectSubset<T, Prisma.PostUpdateArgs>
  ): Promise<Post> {
    if (args.data.draft === false) {
      args.data.createdAt = new Date();
      args.data.updatedAt = new Date();
    }
    return super.update<T>(args);
  }
}
