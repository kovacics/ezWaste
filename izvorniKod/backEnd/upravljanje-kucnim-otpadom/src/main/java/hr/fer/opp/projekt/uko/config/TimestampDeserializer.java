package hr.fer.opp.projekt.uko.config;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import lombok.SneakyThrows;

import java.io.IOException;
import java.sql.Timestamp;
import java.text.SimpleDateFormat;

public final class TimestampDeserializer extends JsonDeserializer<Timestamp> {

    @SneakyThrows
    @Override
    public Timestamp deserialize(JsonParser p, DeserializationContext ctxt) throws IOException, JsonProcessingException {
        String datetime = p.getText();
        SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm");

        return new Timestamp(format.parse(datetime).getTime());
    }
}