import { Injectable } from "@nestjs/common";

@Injectable()
export class UUIDUtil {
  validate(uuid: string) {
    return /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/.test(uuid);
  }
}
