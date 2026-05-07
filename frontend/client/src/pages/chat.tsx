import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, MoreVertical, Paperclip } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchChatRooms, fetchRoomMessages, fetchRoomParticipants, joinCourseRoom, sendRoomMessage } from "@/lib/chatApi";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "wouter";
import { fetchAssignedCourses } from "@/lib/coursesApi";
import { fetchUserProfile } from "@/lib/usersApi";

export default function Chat() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [location] = useLocation();
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [messageText, setMessageText] = useState("");
  const [joinRequestedFor, setJoinRequestedFor] = useState<string | null>(null);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [syncInProgress, setSyncInProgress] = useState(false);
  const [syncAttemptedCourseIds, setSyncAttemptedCourseIds] = useState<string[]>([]);

  const courseIdFromQuery = useMemo(() => {
    const queryIndex = location.indexOf("?");
    if (queryIndex < 0) return null;
    const params = new URLSearchParams(location.slice(queryIndex + 1));
    const value = params.get("courseId")?.trim();
    return value ? value : null;
  }, [location]);

  const { data: rooms = [], isLoading: roomsLoading, isError: roomsError, error: roomsErrorValue } = useQuery({
    queryKey: ["chat-rooms"],
    queryFn: fetchChatRooms,
  });
  const { data: assignedCourses = [], isLoading: assignedLoading } = useQuery({
    queryKey: ["assigned-courses-chat-sync", user?.id],
    queryFn: () => fetchAssignedCourses(),
    enabled: !!user?.id,
  });

  const courseTitlesById = useMemo(() => {
    const entries = assignedCourses
      .filter((course) => !!course.courseId)
      .map((course) => [course.courseId as string, (course.courseTitle ?? "").trim()] as const);
    return new Map(entries);
  }, [assignedCourses]);

  const selectedRoom = useMemo(
    () => rooms.find((room) => room.id === selectedRoomId) ?? rooms[0] ?? null,
    [rooms, selectedRoomId],
  );

  const roomDisplayName = (room: { type: string; courseId?: string | null; name: string }) => {
    if (room.type !== "COURSE" || !room.courseId) return room.name;
    const courseTitle = courseTitlesById.get(room.courseId);
    return courseTitle && courseTitle.length > 0 ? courseTitle : room.name;
  };

  const joinCourseMutation = useMutation({
    mutationFn: (courseId: string) => joinCourseRoom(courseId),
    onSuccess: (room) => {
      setSelectedRoomId(room.id);
      queryClient.invalidateQueries({ queryKey: ["chat-rooms"] });
    },
  });

  useEffect(() => {
    setJoinRequestedFor(null);
  }, [courseIdFromQuery]);

  useEffect(() => {
    if (!courseIdFromQuery) return;

    const existingRoom = rooms.find((room) => room.type === "COURSE" && room.courseId === courseIdFromQuery);
    if (existingRoom) {
      setSelectedRoomId(existingRoom.id);
      return;
    }

    if (roomsLoading || joinCourseMutation.isPending || joinRequestedFor === courseIdFromQuery) {
      return;
    }

    setJoinRequestedFor(courseIdFromQuery);
    joinCourseMutation.mutate(courseIdFromQuery);
  }, [courseIdFromQuery, joinCourseMutation, joinRequestedFor, rooms, roomsLoading]);

  useEffect(() => {
    if (!user?.id || roomsLoading || assignedLoading || joinCourseMutation.isPending) return;

    const assignedCourseIds = Array.from(new Set(
      assignedCourses
        .map((course) => course.courseId)
        .filter((id): id is string => !!id && id.trim().length > 0),
    ));

    if (assignedCourseIds.length === 0) return;

    const existingCourseRoomIds = new Set(
      rooms
        .filter((room) => room.type === "COURSE" && !!room.courseId)
        .map((room) => room.courseId as string),
    );

    const toJoin = assignedCourseIds.filter((id) =>
      !existingCourseRoomIds.has(id) && !syncAttemptedCourseIds.includes(id),
    );

    if (toJoin.length === 0) return;

    setSyncInProgress(true);
    setSyncError(null);

    Promise.allSettled(toJoin.map((id) => joinCourseRoom(id)))
      .then((results) => {
        setSyncAttemptedCourseIds((prev) => Array.from(new Set([...prev, ...toJoin])));
        const successCount = results.filter((result) => result.status === "fulfilled").length;
        if (successCount > 0) {
          queryClient.invalidateQueries({ queryKey: ["chat-rooms"] });
        }
        if (successCount === 0) {
          setSyncError("Не удалось создать чаты по назначенным курсам.");
        }
      })
      .finally(() => {
        setSyncInProgress(false);
      });
  }, [assignedCourses, assignedLoading, joinCourseMutation.isPending, queryClient, rooms, roomsLoading, syncAttemptedCourseIds, user?.id]);

  const { data: messages = [], isLoading: messagesLoading } = useQuery({
    queryKey: ["chat-messages", selectedRoom?.id],
    queryFn: () => fetchRoomMessages(selectedRoom!.id),
    enabled: !!selectedRoom?.id,
    refetchInterval: 3000,
  });

  const { data: participants = [] } = useQuery({
    queryKey: ["chat-participants", selectedRoom?.id],
    queryFn: () => fetchRoomParticipants(selectedRoom!.id),
    enabled: !!selectedRoom?.id,
    refetchInterval: 5000,
  });

  const participantIds = useMemo(
    () => Array.from(new Set(participants.map((participant) => participant.userId).filter(Boolean))),
    [participants],
  );

  const { data: participantNames = new Map<string, string>() } = useQuery({
    queryKey: ["chat-participant-profiles", selectedRoom?.id, participantIds],
    enabled: !!selectedRoom?.id && participantIds.length > 0,
    queryFn: async () => {
      const settled = await Promise.allSettled(
        participantIds.map(async (id) => {
          const profile = await fetchUserProfile(id);
          const fullName = [profile.lastName, profile.firstName].filter(Boolean).join(" ").trim();
          return [id, fullName || profile.email || id] as const;
        }),
      );
      const map = new Map<string, string>();
      settled.forEach((result) => {
        if (result.status === "fulfilled") {
          map.set(result.value[0], result.value[1]);
        }
      });
      return map;
    },
  });

  const displayUserName = (userId: string) => {
    if (user?.id === userId) return "Вы";
    return participantNames.get(userId) ?? userId;
  };

  const sendMutation = useMutation({
    mutationFn: async () => {
      if (!selectedRoom?.id || !messageText.trim()) return null;
      return sendRoomMessage(selectedRoom.id, messageText.trim());
    },
    onSuccess: () => {
      setMessageText("");
      if (selectedRoom?.id) {
        queryClient.invalidateQueries({ queryKey: ["chat-messages", selectedRoom.id] });
        queryClient.invalidateQueries({ queryKey: ["chat-rooms"] });
      }
    },
  });

  return (
    <Layout>
      <div className="flex h-[calc(100vh-8rem)] overflow-hidden rounded-lg border bg-background shadow-sm">
        {/* Sidebar */}
        <div className="w-80 border-r bg-muted/20">
          <div className="p-4 border-b">
            <Input placeholder="Поиск чатов..." />
          </div>
          <div className="overflow-y-auto h-full">
            {roomsLoading && <div className="p-4 text-sm text-muted-foreground">Загрузка чатов...</div>}
            {syncInProgress && <div className="p-4 text-sm text-muted-foreground">Синхронизируем чаты по назначенным курсам...</div>}
            {roomsError && (
              <div className="p-4 text-sm text-destructive">
                Ошибка загрузки чатов: {(roomsErrorValue as Error)?.message ?? "неизвестная ошибка"}
              </div>
            )}
            {joinCourseMutation.isError && (
              <div className="p-4 text-sm text-destructive">
                Ошибка входа в чат курса: {(joinCourseMutation.error as Error)?.message ?? "неизвестная ошибка"}
              </div>
            )}
            {syncError && <div className="p-4 text-sm text-destructive">{syncError}</div>}
            {!roomsLoading && rooms.length === 0 && <div className="p-4 text-sm text-muted-foreground">Нет доступных комнат.</div>}
            {rooms.map((room) => (
              <div
                key={room.id}
                onClick={() => setSelectedRoomId(room.id)}
                className={`flex items-center gap-3 p-4 hover:bg-muted/50 cursor-pointer ${selectedRoom?.id === room.id ? "bg-muted/50" : ""}`}
              >
                <Avatar>
                  <AvatarFallback>CH</AvatarFallback>
                </Avatar>
                <div className="flex-1 overflow-hidden">
                  <div className="flex justify-between">
                    <span className="font-medium truncate">{roomDisplayName(room)}</span>
                    <span className="text-xs text-muted-foreground">
                      {room.updatedAt ? new Date(room.updatedAt).toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" }) : ""}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{room.type}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarFallback>RM</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold">{selectedRoom ? roomDisplayName(selectedRoom) : "Чат не выбран"}</h3>
                <p className="text-xs text-muted-foreground">{participants.length} участника</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messagesLoading && <div className="text-sm text-muted-foreground">Загрузка сообщений...</div>}
            {!messagesLoading && selectedRoom && messages.length === 0 && (
              <div className="text-sm text-muted-foreground">Сообщений пока нет.</div>
            )}
            {messages.map((message) => {
              const own = user?.id === message.userId;
              return (
                <div key={message.id} className={`flex gap-3 ${own ? "flex-row-reverse" : ""}`}>
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{own ? "Я" : "U"}</AvatarFallback>
                  </Avatar>
                  <div className={`flex flex-col ${own ? "items-end" : ""}`}>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold">{displayUserName(message.userId)}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(message.timestamp).toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                    <div className={`${own ? "bg-primary text-primary-foreground rounded-tr-none" : "bg-muted rounded-tl-none"} p-3 rounded-lg text-sm mt-1`}>
                      {message.content}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-4 border-t flex gap-2">
            <Button variant="ghost" size="icon"><Paperclip className="h-4 w-4" /></Button>
            <Input
              placeholder="Напишите сообщение..."
              className="flex-1"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  if (!sendMutation.isPending) sendMutation.mutate();
                }
              }}
              disabled={!selectedRoom}
            />
            <Button size="icon" disabled={!selectedRoom || !messageText.trim() || sendMutation.isPending} onClick={() => sendMutation.mutate()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
