import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Check, GripVertical, AlertCircle, Info } from "lucide-react";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  assignCourse,
  CourseDto,
  fetchRecommendedCourses,
} from "@/lib/coursesApi";

export default function CourseSelection() {
  const [step, setStep] = useState(1);
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [selectedSpecialization, setSelectedSpecialization] = useState<string>("");
  const { toast } = useToast();
  const { user, updateSpecialization } = useAuth();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["courses-recommended", user?.specialization],
    queryFn: () => fetchRecommendedCourses({ page: 0, size: 60 }),
  });

  const courses = data?.content ?? [];
  const selectedCourseList = useMemo(
    () => courses.filter((course) => selectedCourses.includes(course.id)),
    [courses, selectedCourses],
  );

  const assignMutation = useMutation({
    mutationFn: async (courseIds: string[]) => {
      if (!user?.id) {
        throw new Error("Пользователь не авторизован");
      }
      await Promise.all(
        courseIds.map((courseId) =>
          assignCourse({
            userId: user.id,
            courseId,
            assignedBy: user.id,
          }),
        ),
      );
    },
  });

  const toggleCourse = (id: string) => {
    if (selectedCourses.includes(id)) {
      setSelectedCourses(prev => prev.filter(c => c !== id));
    } else {
      if (selectedCourses.length >= 3) {
        toast({
          title: "Максимум 3 курса",
          description: "Вы не можете выбрать более 3 курсов одновременно.",
          variant: "destructive"
        });
        return;
      }
      setSelectedCourses(prev => [...prev, id]);
    }
  };

  const nextStep = () => {
    if (step === 2 && selectedCourses.length !== 3) {
      toast({
        title: "Выберите 3 курса",
        description: "Для продолжения необходимо выбрать ровно 3 курса.",
        variant: "destructive"
      });
      return;
    }
    setStep(prev => prev + 1);
  };

  const prevStep = () => setStep(prev => prev - 1);

  const saveSpecialization = async () => {
    const value = selectedSpecialization || user?.specialization || "";
    if (!value) {
      toast({
        title: "Выберите специализацию",
        description: "Без специализации рекомендации будут общими.",
        variant: "destructive",
      });
      return;
    }
    try {
      await updateSpecialization(value);
      toast({
        title: "Специализация обновлена",
        description: "Список курсов подгружен с учетом выбранной специализации.",
      });
      nextStep();
    } catch (e) {
      toast({
        title: "Не удалось обновить специализацию",
        description: (e as Error).message,
        variant: "destructive",
      });
    }
  };

  const difficultyLabel = (course: CourseDto) => {
    if (!course.difficulty) return "Сложность не указана";
    if (course.difficulty === "BEGINNER") return "Начальный";
    if (course.difficulty === "INTERMEDIATE") return "Средний";
    return "Продвинутый";
  };

  const durationLabel = (course: CourseDto) => {
    if (!course.durationMinutes) return "Длительность не указана";
    const hours = Math.round((course.durationMinutes / 60) * 10) / 10;
    return `${hours} ч`;
  };

  return (
    <Layout>
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-secondary">Выбор курсов на текущий квартал</h1>
          <p className="text-muted-foreground">Пройдите этапы выбора для формирования плана обучения</p>
        </div>

        {/* Wizard Progress */}
        <div className="relative">
          <Progress value={step * 33.3} className="h-2" />
          <div className="absolute top-0 mt-[-6px] flex w-full justify-between px-1">
            {[1, 2, 3].map((s) => (
              <div 
                key={s}
                className={`flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                  step >= s ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'
                }`}
              >
                {s}
              </div>
            ))}
          </div>
          <div className="mt-2 flex w-full justify-between px-0 text-xs text-muted-foreground">
            <span>Специальность</span>
            <span>Выбор курсов</span>
            <span>Утверждение</span>
          </div>
        </div>

        {/* Step 1: Specialization */}
        {step === 1 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Ваша специальность</h2>
                <div className="space-y-4">
                  <div className="rounded-lg border bg-card p-4">
                    <div className="text-sm text-muted-foreground">Специализация из профиля</div>
                    <div className="mt-1 text-lg font-semibold">
                      {user?.specialization ?? "Не указана"}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Select
                      value={selectedSpecialization || user?.specialization || ""}
                      onValueChange={setSelectedSpecialization}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите специализацию" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Software Engineering">Разработка ПО</SelectItem>
                        <SelectItem value="Project Management">Управление проектами</SelectItem>
                        <SelectItem value="Data Analytics">Аналитика данных</SelectItem>
                        <SelectItem value="Information Security">Информационная безопасность</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {!user?.specialization && (
                    <div className="flex items-center gap-2 text-sm text-amber-700 bg-amber-50 p-3 rounded-md border border-amber-100">
                      <AlertCircle className="h-4 w-4" />
                      Специализация не указана в профиле, будут показаны все активные курсы.
                    </div>
                  )}
                  <div className="flex justify-end">
                    <Button onClick={saveSpecialization}>Продолжить</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Step 2: Course Selection */}
        {step === 2 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Выберите 3 курса из списка</h2>
              <div className="text-sm font-medium">
                Выбрано: <span className={selectedCourses.length === 3 ? "text-green-600" : "text-primary"}>{selectedCourses.length}/3</span>
              </div>
            </div>

            {isLoading && (
              <div className="rounded-lg border p-6 text-center text-sm text-muted-foreground">
                Загрузка курсов...
              </div>
            )}
            {isError && (
              <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-6 text-sm text-destructive">
                Не удалось загрузить курсы. {(error as Error).message}
              </div>
            )}
            {!isLoading && !isError && courses.length === 0 && (
              <div className="rounded-lg border p-6 text-center text-sm text-muted-foreground">
                Доступных курсов пока нет.
              </div>
            )}
            <div className="grid gap-4">
              {courses.map((course) => (
                <div 
                  key={course.id}
                  className={`group relative flex items-start gap-4 rounded-lg border p-4 transition-all hover:shadow-md ${
                    selectedCourses.includes(course.id) ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'bg-card'
                  }`}
                  onClick={() => toggleCourse(course.id)}
                >
                  <div className="h-24 w-40 flex-shrink-0 overflow-hidden rounded-md bg-gradient-to-br from-slate-100 via-slate-50 to-slate-200 flex items-center justify-center text-slate-500 text-xs font-medium">
                    Курс
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-bold">{course.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {difficultyLabel(course)} • {durationLabel(course)}
                        </p>
                      </div>
                      <div className="font-bold text-primary">
                        {course.status === "ACTIVE" ? "Доступен" : "Черновик"}
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                      {course.description || "Описание пока не заполнено."}
                    </p>
                    <div className="mt-3 flex gap-2">
                      <Badge variant="secondary" className="text-xs">{course.categoryId ?? "Без категории"}</Badge>
                      <Badge variant="outline" className="text-xs">{course.status ?? "Статус"}</Badge>
                    </div>
                  </div>
                  <div className={`absolute right-4 top-4 h-6 w-6 rounded-full border-2 transition-colors ${
                    selectedCourses.includes(course.id) ? 'border-primary bg-primary text-white' : 'border-muted-foreground'
                  }`}>
                    {selectedCourses.includes(course.id) && <Check className="h-4 w-4 m-0.5" />}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={prevStep}>Назад</Button>
              <Button onClick={nextStep} disabled={selectedCourses.length !== 3}>Далее</Button>
            </div>
          </motion.div>
        )}

        {/* Step 3: Confirmation */}
        {step === 3 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-6">Приоритизация и отправка</h2>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground bg-blue-50 p-3 rounded-md border border-blue-100 text-blue-800">
                    <Info className="h-4 w-4" />
                    Перетащите курсы, чтобы расставить приоритеты. Курс №1 будет рассмотрен в первую очередь.
                  </div>

                  {selectedCourseList.map((course, index) => (
                    <div key={course.id} className="flex items-center gap-4 rounded-lg border bg-card p-4 shadow-sm">
                      <div className="flex h-8 w-8 cursor-move items-center justify-center text-muted-foreground hover:text-foreground">
                        <GripVertical className="h-5 w-5" />
                      </div>
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-white font-bold text-sm">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold">{course.title}</h4>
                        <p className="text-sm text-muted-foreground">{difficultyLabel(course)}</p>
                      </div>
                      <div className="font-medium">{durationLabel(course)}</div>
                    </div>
                  ))}
                  
                  <div className="flex justify-end border-t pt-4">
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Итоговая длительность:</p>
                      <p className="text-xl font-bold text-primary">
                        {selectedCourseList.reduce((sum, c) => sum + (c.durationMinutes ?? 0), 0)} мин
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-sm font-medium">Комментарий для руководителя (обоснование выбора)</label>
                  <Textarea placeholder="Опишите, как эти курсы помогут в вашей работе..." className="min-h-[100px]" />
                </div>

                <div className="flex justify-end gap-3 pt-6">
                  <Button variant="outline" onClick={prevStep}>Назад</Button>
                  <Button
                    className="bg-green-600 hover:bg-green-700"
                    disabled={assignMutation.isPending}
                    onClick={async () => {
                      try {
                        await assignMutation.mutateAsync(selectedCourses);
                        toast({
                          title: "Заявка отправлена",
                          description: "Ваш выбор зафиксирован в системе.",
                        });
                      } catch (err) {
                        toast({
                          title: "Ошибка при отправке",
                          description: (err as Error).message,
                          variant: "destructive",
                        });
                      }
                    }}
                  >
                    Отправить на согласование
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </Layout>
  );
}
