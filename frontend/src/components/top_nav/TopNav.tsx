import "./TopNav.css";
import UserDropdown from "./user_dropdown/UserDropdown";
import { SlArrowRight } from "react-icons/sl";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { useRef, useState } from "react";
import { updateTeam } from "../../redux/reducers/teams";
import type { Team, User } from "../../types/Models";
import { useNavigate, useParams } from "react-router";
import { boardsSlice, selectBoardById } from "../../redux/reducers/boards";
import { setRootBoard } from "../../redux/reducers/session";

export default function TopNav() {
	const { boardId } = useParams();

	const [awaitingDelConf, setAwaitingDelConf] = useState<boolean>(false);
	const [deleteBtnContent, setDeleteBtnContent] =
		useState<string>("Leave Team");

	const deleteBtn = useRef<HTMLDivElement | null>(null);

	const user = useAppSelector((state) => state.session.user);
	const team = useAppSelector((state) =>
		state.team ? state.team.team : undefined,
	);
	const board = useAppSelector((state) =>
		boardId ? selectBoardById(state, Number(boardId)) : null,
	);

	const dispatch = useAppDispatch();
	const navigate = useNavigate();

	function showSidePanel(): void {
		const sidePanel = document.querySelector("#side-panel");
		if (!sidePanel) return;
		sidePanel.id = sidePanel.id.concat("-show");
	}

	const handleDelete = async () => {
		if (!team?.id || !deleteBtn.current) return;

		if (!awaitingDelConf) {
			deleteBtn.current.addEventListener(
				"mouseleave",
				() => {
					setDeleteBtnContent("Leave Team");
					setAwaitingDelConf(false);
				},
				{ once: true },
			);

			setAwaitingDelConf(true);

			setDeleteBtnContent("Click again to leave team");
		} else {
			setAwaitingDelConf(false);

			dispatch(
				updateTeam({
					owner_id: (user as User).id,
					emails: team.emails.filter(
						(el: string) => el !== (user as User).email,
					),
					team_id: (team as Team).id,
				}),
			).then(() => {
				boardsSlice.actions.clearState();
				navigate("/boards");
			});
		}
	};

	const setRoot = () => {
		if (!board) return; // this will never be true

		dispatch(setRootBoard(board.id));
	};

	return (
		<nav className="top-nav">
			<SlArrowRight
				onMouseEnter={showSidePanel}
				className={`arrow-box ${boardId ? "" : "invisible"}`}
			/>
			<div className="user-buttons">
				{board &&
					user &&
					user.root_board_id !== Number(boardId ? boardId : "0") &&
					board.owner_id === user?.id && (
						<div className="set-home" onClick={setRoot}>
							Set as home board
						</div>
					)}
				{boardId && team && team.owner_id !== user?.id && (
					<div
						className="leave-team"
						onMouseDown={handleDelete}
						ref={deleteBtn}
					>
						{deleteBtnContent}
					</div>
				)}
				<UserDropdown boardId={Number(boardId)} />
			</div>
		</nav>
	);
}
