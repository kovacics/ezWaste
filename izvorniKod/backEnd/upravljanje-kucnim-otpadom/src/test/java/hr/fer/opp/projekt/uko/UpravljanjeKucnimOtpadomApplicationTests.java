package hr.fer.opp.projekt.uko;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotEquals;
import static org.junit.Assert.fail;

import java.util.Optional;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import hr.fer.opp.projekt.uko.exception.BadRequestException;
import hr.fer.opp.projekt.uko.api.model.User;
import hr.fer.opp.projekt.uko.api.model.enums.Role;
import hr.fer.opp.projekt.uko.api.rest.services.UsersService;

@RunWith(SpringJUnit4ClassRunner.class)
@SpringBootTest
public class UpravljanjeKucnimOtpadomApplicationTests {
	
	UsersService serv=new UsersService();

    @Test
    public void returnsEmptyIfUserIsNotFOund() {
    	assertEquals(Optional.empty(), serv.getUser(-1));
    }
    
    @Test(expected=BadRequestException.class)
    public void cantCreateTwoUsersWithSameUsername() {
    	serv.saveUser("a", "bbbbbbbb", "firstName", "lastName", "city", "street",1, "email", Role.ADMIN);
    	serv.saveUser("a", "bbbbbbbb", "firstName", "lastName", "city", "street",1, "email", Role.ADMIN);
    	fail();
    }
    
    @Test(expected=IllegalArgumentException.class)
    public void userNameCantBeNull() {
    	serv.saveUser(null, "bbbbbbb", "firstName", "lastName", "city", "street",1, "email", Role.ADMIN);
    	fail();
    }
    
    @Test(expected=IllegalArgumentException.class)
    public void userNameCantBeBlank() {
    	serv.saveUser("", "bbbbbbb", "firstName", "lastName", "city", "street",1, "email", Role.ADMIN);
    	fail();
    }
    
    @Test(expected=IllegalArgumentException.class)
    public void passwordNameCantBeNull() {
    	serv.saveUser("a", null, "firstName", "lastName", "city", "street",1, "email", Role.ADMIN);
    	fail();
    }
    
    @Test(expected=IllegalArgumentException.class)
    public void passwordNameCantBeBlank() {
    	serv.saveUser("a", "", "firstName", "lastName", "city", "street",1, "email", Role.ADMIN);
    	fail();
    }
    
    @Test(expected=IllegalArgumentException.class)
    public void passwordLengthMustBeGreaterOrEquals8() {
    	serv.saveUser("a", "bbbbbbbb", "firstName", "lastName", "city", "street",1, "email", Role.ADMIN);
    	fail();
    }
    
    @Test(expected=IllegalArgumentException.class)
    public void roleMustNotBeNull() {
    	serv.saveUser("a", "bbbbbbbb", "firstName", "lastName", "city", "street",1, "email", null);
    	fail();
    }
    
    @Test
    public void getByUsername() {
    	serv.saveUser("a", "bbbbbbbb", "firstName", "lastName", "city", "street",1, "email", Role.ADMIN);
    	User user=serv.getUserByUsername("a").get();
    	if(!user.getUsername().equals("a")) {
    		fail();
    	}
    }
    
    @Test
    public void userDeleteTest() {
    	serv.saveUser("a", "bbbbbbbb", "firstName", "lastName", "city", "street",1, "email", Role.ADMIN);
    	User toBeDeleted=serv.getUserByUsername("a").get();
    	serv.deleteUser(toBeDeleted.getID());
    }
    
    
}
