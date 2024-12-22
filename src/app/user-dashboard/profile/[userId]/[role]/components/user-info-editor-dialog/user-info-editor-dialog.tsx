import { PenLineSvgIcon } from "@/app/_components/svg-icons/ui/pen-line-svg-icon";
import { Button } from "@/app/_components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/app/_components/ui/dialog";
import { type User } from "@prisma/client";

interface UserInfoEditorDialogProps {
	user: User;
}

export function UserInfoEditorDialog({ user }: UserInfoEditorDialogProps) {
	return (
		<>
			<Dialog>
				<DialogTrigger>
					<Button
						variant="ghost"
						className="py-0"
					>
						<PenLineSvgIcon className="size-8 stroke-black"/>
					</Button>
				</DialogTrigger>
				<DialogContent >
					<DialogHeader>
						<DialogTitle>Are you absolutely sure?</DialogTitle>
						
						<DialogDescription>
							This action cannot be undone. This will permanently delete your account
							and remove your data from our servers.
							<Button>hello</Button>
						</DialogDescription>
					</DialogHeader>
				</DialogContent>
			</Dialog>
		</>
	);
};
