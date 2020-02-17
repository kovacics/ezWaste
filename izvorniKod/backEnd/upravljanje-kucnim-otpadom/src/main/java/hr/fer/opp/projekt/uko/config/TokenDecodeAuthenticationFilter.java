package hr.fer.opp.projekt.uko.config;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import hr.fer.opp.projekt.uko.api.dao.UsersRepository;
import hr.fer.opp.projekt.uko.api.model.User;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class TokenDecodeAuthenticationFilter extends OncePerRequestFilter {
    private UsersRepository usersRepository;

    public TokenDecodeAuthenticationFilter(UsersRepository usersRepository) {
        this.usersRepository = usersRepository;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        String header = request.getHeader(JwtProperties.HEADER_STRING);

        if (header == null || header.isBlank() || !header.startsWith(JwtProperties.TOKEN_PREFIX)) {
            chain.doFilter(request, response);
            return;
        }

        Authentication authentication = getUsernamePasswordAuthentication(header);
        SecurityContextHolder.getContext().setAuthentication(authentication);

        // Continue filter execution
        chain.doFilter(request, response);
    }

    private Authentication getUsernamePasswordAuthentication(String header) {
        String token = header.replace(JwtProperties.TOKEN_PREFIX, "");

        String userName;
        try {
            userName = JWT.require(Algorithm.HMAC512(JwtProperties.SECRET.getBytes()))
                    .build()
                    .verify(token)
                    .getSubject();
        } catch (JWTVerificationException e) {
            return null;
        }

        if (userName != null) {
            User user = usersRepository.findByUsername(userName).orElse(null);
            if (user == null) return null;

            CustomUserDetails principal = new CustomUserDetails(user);
            return new UsernamePasswordAuthenticationToken(principal, null, principal.getAuthorities());
        }
        return null;
    }
}
