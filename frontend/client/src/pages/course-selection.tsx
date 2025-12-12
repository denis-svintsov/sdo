import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { COURSES } from "@/lib/mock-data";
import { Check, X, GripVertical, AlertCircle, Info } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

export default function CourseSelection() {
  const [step, setStep] = useState(1);
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const { toast } = useToast();

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

  return (
    <Layout>
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-secondary">Выбор курсов на Q3 2024</h1>
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
                <h2 className="text-xl font-semibold mb-4">Подтвердите вашу специальность</h2>
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <Button 
                      variant="outline" 
                      className="h-auto justify-start p-4 text-left hover:border-primary hover:bg-primary/5"
                      onClick={nextStep}
                    >
                      <div>
                        <div className="font-semibold">Разработка ПО</div>
                        <div className="text-sm text-muted-foreground">Frontend, Backend, DevOps</div>
                      </div>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="h-auto justify-start p-4 text-left hover:border-primary hover:bg-primary/5"
                      onClick={nextStep}
                    >
                      <div>
                        <div className="font-semibold">Управление проектами</div>
                        <div className="text-sm text-muted-foreground">Agile, Scrum, Product Owner</div>
                      </div>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="h-auto justify-start p-4 text-left hover:border-primary hover:bg-primary/5"
                      onClick={nextStep}
                    >
                      <div>
                        <div className="font-semibold">Аналитика данных</div>
                        <div className="text-sm text-muted-foreground">Data Science, BI, SQL</div>
                      </div>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="h-auto justify-start p-4 text-left hover:border-primary hover:bg-primary/5"
                      onClick={nextStep}
                    >
                      <div>
                        <div className="font-semibold">Информационная безопасность</div>
                        <div className="text-sm text-muted-foreground">Pentest, SecOps, Compliance</div>
                      </div>
                    </Button>
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

            <div className="grid gap-4">
              {COURSES.map((course) => (
                <div 
                  key={course.id}
                  className={`group relative flex items-start gap-4 rounded-lg border p-4 transition-all hover:shadow-md ${
                    selectedCourses.includes(course.id) ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'bg-card'
                  }`}
                  onClick={() => toggleCourse(course.id)}
                >
                  <div className="h-24 w-40 flex-shrink-0 overflow-hidden rounded-md bg-muted">
                    <img src={course.image} alt={course.title} className="h-full w-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-bold">{course.title}</h3>
                        <p className="text-sm text-muted-foreground">{course.provider} • {course.format}</p>
                      </div>
                      <div className="font-bold text-primary">
                        {course.price.toLocaleString()} ₽
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{course.description}</p>
                    <div className="mt-3 flex gap-2">
                      <Badge variant="secondary" className="text-xs">{course.category}</Badge>
                      <Badge variant="outline" className="text-xs">Рейтинг {course.rating}</Badge>
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

                  {COURSES.filter(c => selectedCourses.includes(c.id)).map((course, index) => (
                    <div key={course.id} className="flex items-center gap-4 rounded-lg border bg-card p-4 shadow-sm">
                      <div className="flex h-8 w-8 cursor-move items-center justify-center text-muted-foreground hover:text-foreground">
                        <GripVertical className="h-5 w-5" />
                      </div>
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-white font-bold text-sm">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold">{course.title}</h4>
                        <p className="text-sm text-muted-foreground">{course.provider}</p>
                      </div>
                      <div className="font-medium">
                        {course.price.toLocaleString()} ₽
                      </div>
                    </div>
                  ))}
                  
                  <div className="flex justify-end border-t pt-4">
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Итоговая стоимость:</p>
                      <p className="text-xl font-bold text-primary">
                        {COURSES.filter(c => selectedCourses.includes(c.id)).reduce((sum, c) => sum + c.price, 0).toLocaleString()} ₽
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
                  <Button className="bg-green-600 hover:bg-green-700" onClick={() => toast({ title: "Заявка отправлена", description: "Ваш выбор передан на согласование руководителю." })}>
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
