import {Test, TestingModule} from "@nestjs/testing";
import {UsersService} from "./users.service";
import {getRepositoryToken} from "@nestjs/typeorm";
import {User} from "./user.entity";
import {DeleteResult, InsertResult} from "typeorm";
import {BadRequestException} from "@nestjs/common";
import {dataCollectionDao} from "../dao/dataCollection.dao";

describe("user service", ()=>{
    let service:  UsersService;
    let validUuid1: string= "7e43dcec-a5b9-4598-9712-b898ba352195";
    let validUuid2: string= "vb5b66927-f1f1-47ac-9207-d4e842d9a022";
    let invalidUuid: string= "d9428888-122b-11e1-b85c-61cd3cbb3210";

    const mockDataCollectionDao = {};

    const mockRepository = {
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
                useValue: mockRepository,
                },
                {provide: dataCollectionDao,
                useValue: mockDataCollectionDao}
            ]
        }).compile();

        service = moduleFixture.get<UsersService>(UsersService);
    });

    it("should throw error over bad uuid", async ()=>{
        try{
            await service.findOne(invalidUuid)
        }
        catch(error){
            expect(error).toStrictEqual(new BadRequestException("invalid uuid"));
        }
    });

    it("should return an array of all users", async ()=>{
        let users:User[] = await service.findAll();
        let user:User = users[0];

        expect(users).toBeInstanceOf(Array);
        expect(typeof user).toBe(typeof new User);
    })

    it("should return singular user by id", async ()=>{
        let user:User = await service.findOne(validUuid1);

        expect(typeof user).toBe(typeof new User);

        expect(user.id).toBe(validUuid1)
    })

    it("should put user into database", async ()=>{
        let spy = jest.spyOn(mockRepository,"insert")

        await service.putOne({id:validUuid1,username:"123"});

        expect(spy).toHaveBeenCalledWith({id:validUuid1,username:"123"})
    })

    it("should delete user from database", async ()=>{
        let spy = jest.spyOn(mockRepository,"delete")

        await service.remove(validUuid1);

        expect(spy).toHaveBeenCalledWith(validUuid1)
    })
})