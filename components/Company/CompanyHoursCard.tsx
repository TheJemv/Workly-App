import { Text } from "react-native";

import { DataDays, Day } from "@/types/Schedule";
import { Container, CardInfo, CardContent, Row } from "components/CardInfo";
import { SCHEDULE_DAYS, todayIndex } from "utils/companySchedule";

export default function CompanyHoursCard({ businessHours }: { businessHours: DataDays }) {
   const today = SCHEDULE_DAYS[todayIndex()];

   return (
      <Container>
         <CardInfo title="Horarios" icon="clock" variant="heading" />
         <CardContent>
            {SCHEDULE_DAYS.map((day) => {
               const schedule: Day | undefined = businessHours[day];
               const isToday = day === today;

               return (
                  <Row
                     key={day}
                     label={isToday ? `${day} · hoy` : day}
                     value={
                        schedule?.open ? (
                           <Text
                              className="text-sm font-medium"
                              style={{ color: isToday ? "#15803d" : "#040404" }}
                           >
                              {schedule.intervals.start}
                              <Text className="text-text-light"> – </Text>
                              {schedule.intervals.end}
                           </Text>
                        ) : (
                           <Text className="text-sm text-text-light italic">Cerrado</Text>
                        )
                     }
                  />
               );
            })}
         </CardContent>
      </Container>
   );
}
