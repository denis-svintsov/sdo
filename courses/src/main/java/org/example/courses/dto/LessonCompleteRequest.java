package org.example.courses.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

/**
 * Тело запроса для завершения урока.
 * userId можно брать из токена, но здесь явно передаём для простоты интеграции.
 */
public record LessonCompleteRequest(
        @NotNull String userId,
        /**
         * Дополнительно время, затраченное на урок, в секундах.
         */
        @PositiveOrZero Long timeSpentSeconds
) {
}

