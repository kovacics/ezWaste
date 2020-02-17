package hr.fer.opp.projekt.uko.config;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import lombok.SneakyThrows;

import java.io.IOException;
import java.sql.Time;
import java.text.DateFormat;
import java.text.SimpleDateFormat;

public final class SqlTimeDeserializer extends JsonDeserializer<Time> {

    @SneakyThrows
    @Override
    public Time deserialize(JsonParser p, DeserializationContext ctxt) throws IOException, JsonProcessingException {
        String time = p.getText();
        DateFormat formatter = new SimpleDateFormat("HH:mm");

        return new Time(formatter.parse(time).getTime());
    }
}