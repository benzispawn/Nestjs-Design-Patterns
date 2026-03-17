import { Injectable } from "@nestjs/common";
import { v4 as uuidv4 } from 'uuid';
import { UuidGenerator } from "./uuid-generator";

@Injectable()
export class DefaultUuidGenerator extends UuidGenerator {
    generate(): string {
        return uuidv4();
    }
}