import { Badge } from "@/components/ui/badge";
import { ChatMessageForView } from "@/types";
import { Bot, Pyramid, User as UserIcon } from "lucide-react";

type InstructionBubbleProps = {
  message: ChatMessageForView;
};

export default function InstructionBubble(props: InstructionBubbleProps) {
  return (
    <div className="bg-neutral-100 font-semibold p-4">
      <Badge className="bg-white text-neutral-700 rounded-xs">
        <Pyramid />
        Instruction
      </Badge>
      <p className="mt-2 text-neutral-700">{props.message.content}</p>
    </div>
  );
}
