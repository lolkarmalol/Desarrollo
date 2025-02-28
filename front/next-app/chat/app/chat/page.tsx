import ChatComponent from "@/components/ChatComponent";


const response = await fetch("http://8.20.0.5:3003/api/salas", {
  method: "GET"
});

const salas = await response.json();

console.log("salas", salas);


interface ChatPageProps {
  salas: any;
}

export default function ChatPage() {
  return (
    <div>
      <ChatComponent salas={
        salas}
        />
    </div>
  );
}
