package hr.fer.opp.projekt.uko.util;

import hr.fer.opp.projekt.uko.config.CustomUserDetails;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.PathVariable;

@Component
public class AuthorizationUtil {

    public boolean currentUserRole(String role) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        for (GrantedAuthority authority : auth.getAuthorities()) {
            if (authority.toString().equals(role)) {
                return true;
            }
        }
        return false;
    }

    public boolean currentUser(int userID) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails authenticated = ((CustomUserDetails) auth.getPrincipal());

        return authenticated.getID() == userID;
    }

    public boolean currentUserOrAdminOrEmployee(@PathVariable int userID) {
        return currentUserRole("ROLE_CITIZEN") && currentUser(userID)
                || currentUserRole("ROLE_ADMIN")
                || currentUserRole("ROLE_EMPLOYEE");
    }
}
