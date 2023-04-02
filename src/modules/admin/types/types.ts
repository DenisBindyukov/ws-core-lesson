import {IsString} from 'class-validator'


export class AdminDtoType {
    @IsString()
    value: string;

    @IsString()
    id: string;
}