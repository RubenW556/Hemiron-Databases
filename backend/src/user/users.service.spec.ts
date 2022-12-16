import {Test, TestingModule} from "@nestjs/testing";
import {UsersService} from "./users.service";
import {getRepositoryToken} from "@nestjs/typeorm";
import {User} from "./user.entity";
import {DeleteResult, InsertResult} from "typeorm";
import {BadRequestException} from "@nestjs/common";

describe("user service", ()=>{
    let service:  UsersService;
    let validUuid1: string= "7e43dcec-a5b9-4598-9712-b898ba352195";
    let validUuid2: string= "vb5b66927-f1f1-47ac-9207-d4e842d9a022";
    const mockUserRepository = {
        find: jest.fn(function(){
            let user:User[] = [{id:validUuid1,username:"123"},{id:validUuid2,username:"123"}]
            return user;
        }),
        findOneBy: jest.fn(function(id){
            return {id: id.id, username: "123" };
        }),
        insert: jest.fn(function(){
            return new InsertResult;
        }),
        delete: jest.fn(function(){
            return new DeleteResult;
        })
    }

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            providers: [
                UsersService,
                {provide: getRepositoryToken(User),
                useValue: mockUserRepository,
                }
            ]
        }).compile();

        service = moduleFixture.get<UsersService>(UsersService);
    });

    it("should return an array of all users", async ()=>{
        let users:User[] = await service.findAll();
        let user:User = users[0];

        expect(users).toBeInstanceOf(Array);
        expect(typeof user).toBe(typeof new User);
    })

    it("should ask repository with id", async ()=>{
        let spy = jest.spyOn(mockUserRepository,"findOneBy")

        await service.findOne(validUuid1);

        expect(spy).toHaveBeenCalledWith({id:validUuid1})
    })

    it("should put user into database", async ()=>{
        let spy = jest.spyOn(mockUserRepository,"insert")

        await service.putOne({id:validUuid1,username:"123"});

        expect(spy).toHaveBeenCalledWith({id:validUuid1,username:"123"})
    })

    it("should delete user by uuid", async ()=>{
        let spy = jest.spyOn(mockUserRepository,"delete")

        await service.remove(validUuid1);

        expect(spy).toHaveBeenCalledWith(validUuid1)
    })
})