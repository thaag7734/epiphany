import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { type ReactElement, useEffect, useRef, useState } from "react";
import type { Team, User } from "../../types/Models";
import { createTeam, deleteTeam, updateTeam } from "../../redux/reducers/teams";
import ErrorMessage from "../ErrorMessage";
import { FaTrash } from "react-icons/fa";
import "./TeamsModal.css";
import { type ModalContextType, useModal } from "../Modal/Modal";

export default function TeamsModal() {
	const boardId = useAppSelector((state) => state.session.currentBoardId);
	const team = useAppSelector((state) => state.team?.team);
	const user = useAppSelector((state) => state.session.user);

	const [email, setEmail] = useState("");
	const [teamEmails, setTeamEmails] = useState<string[]>([]);
	const [error, setError] = useState<ReactElement | null>(null);
	const [awaitingDelConf, setAwaitingDelConf] = useState<boolean>(false);
	const [deleteBtnContent, setDeleteBtnContent] = useState<
		ReactElement | string
	>(
		<>
			<FaTrash /> Delete Team
		</>,
	);

	const deleteTeamBtn = useRef<HTMLButtonElement | null>(null);
	const { closeModal } = useModal() as ModalContextType;

	const dispatch = useAppDispatch();

	const createNewTeam = async () => {
		dispatch(
			createTeam({
				owner_id: (user as User).id,
				board_id: Number(boardId),
				emails: [],
			}),
		);
	};

	useEffect(() => {
		if (!team) {
			createNewTeam();
		} else {
			setTeamEmails(team.emails);
		}
	}, [team]);

	const addUser = async () => {
		if (!email || !team) return;

		setTeamEmails(teamEmails.concat(email));

		dispatch(
			updateTeam({
				owner_id: (user as User).id,
				emails: teamEmails.concat(email),
				team_id: team.id,
			}),
		).then(({ payload }) => {
			if (!payload?.team?.emails.includes(email))
				setError(
					<ErrorMessage msg={"Email must be associated with existing user"} />,
				);
			setEmail("");
		});
	};

	const handleDelete = async (index: number) => {
		if (!team) return; // this will never be true

		const timeout = setTimeout(() => {
			dispatch(
				updateTeam({
					emails: teamEmails
						.slice(0, index)
						.concat(teamEmails.slice(index + 1)),
					team_id: (team as Team).id,
				}),
			);
			// TODO error handling if deletion fails
		}, 1000);

		addEventListener(
			"mouseup",
			() => {
				clearTimeout(timeout);
			},
			{ once: true },
		);
	};

	const handleDeleteTeam = () => {
		if (!team || !deleteTeamBtn.current) return;

		//const timeout = setTimeout(() => {
		//  dispatch(deleteNote(noteId)).then(() => closeModal());
		//}, 3000);
		//addEventListener(
		//  "mouseup",
		//  () => {
		//    clearTimeout(timeout);
		//  },
		//  { once: true },
		//);

		if (!awaitingDelConf) {
			deleteTeamBtn.current.addEventListener(
				"mouseleave",
				() => {
					setDeleteBtnContent(
						<>
							<FaTrash /> Delete Team
						</>,
					);
					setAwaitingDelConf(false);
				},
				{ once: true },
			);

			setAwaitingDelConf(true);

			setDeleteBtnContent("Really delete this team?");
		} else {
			setAwaitingDelConf(false);

			dispatch(deleteTeam(team.id)).then(({ payload, type }) => {
				if (type === "teams/deleteTeam/rejected") {
					setError(<ErrorMessage msg={payload.message} />);
				} else {
					closeModal();
				}
			});
		}
	};

	return (
		<div className="teams-modal">
			{team && (team as Team).emails ? (
				<h1>Manage your team</h1>
			) : (
				<h1>Add users to start team</h1>
			)}
			<div className="add-user-team">
				<input
					type="text"
					className="add-user"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					placeholder="Type a user's e-mail to add to your team!"
					onBlur={addUser}
				/>
				{error}
			</div>
			<ul>
				{team ? (
					<>
						{(team as Team).emails.map((teamMember, index) => (
							<li key={teamMember}>
								<div
									className="delete-team-member"
									title="Hold 1s to delete"
									onMouseDown={() => {
										handleDelete(index);
									}}
								>
									<FaTrash />
								</div>
								<div className="team-member">{teamMember}</div>
							</li>
						))}
					</>
				) : (
					<h2>Loading Team</h2>
				)}
			</ul>
			{team && (
				<button
					type="button"
					className="delete-btn"
					onClick={handleDeleteTeam}
					ref={deleteTeamBtn}
				>
					{deleteBtnContent}
				</button>
			)}
		</div>
	);
}
