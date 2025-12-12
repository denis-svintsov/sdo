import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import { ru } from "date-fns/locale";

export default function CalendarPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <Layout>
      <div className="space-y-6 h-full flex flex-col">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-secondary">Расписание</h1>
          <p className="text-muted-foreground">Календарь занятий и дедлайнов</p>
        </div>

        <div className="grid gap-6 md:grid-cols-[300px_1fr] h-full">
          <Card className="h-fit">
            <CardContent className="p-4">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                locale={ru}
                className="rounded-md border shadow-sm w-full"
              />
            </CardContent>
          </Card>

          <Card className="flex-1">
            <CardHeader>
              <CardTitle>События на {date?.toLocaleDateString('ru-RU')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-4 items-start border-l-4 border-primary pl-4 py-1">
                    <div className="text-sm font-bold w-12 pt-1">10:00</div>
                    <div>
                        <h4 className="font-semibold">Лекция: Архитектура Angular</h4>
                        <p className="text-sm text-muted-foreground">Онлайн • Stepik</p>
                    </div>
                </div>

                <div className="flex gap-4 items-start border-l-4 border-muted pl-4 py-1 opacity-60">
                    <div className="text-sm font-bold w-12 pt-1">14:00</div>
                    <div>
                        <h4 className="font-semibold">Встреча с ментором</h4>
                        <p className="text-sm text-muted-foreground">Зал совещаний 3</p>
                    </div>
                </div>

                <div className="flex gap-4 items-start border-l-4 border-orange-500 pl-4 py-1">
                    <div className="text-sm font-bold w-12 pt-1">18:00</div>
                    <div>
                        <h4 className="font-semibold">Дедлайн: Загрузка домашнего задания</h4>
                        <p className="text-sm text-muted-foreground">Курс "Python Basic"</p>
                    </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
