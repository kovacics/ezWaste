package hr.fer.opp.projekt.uko.config;

public class JwtProperties {
    public static final String SECRET = "Muuurin05";
    public static final int EXPIRATION_TIME = 60 * 60 * 1000 * 10; // 10 hours
    public static final String TOKEN_PREFIX = "Bearer ";
    public static final String HEADER_STRING = "Authorization";
}
