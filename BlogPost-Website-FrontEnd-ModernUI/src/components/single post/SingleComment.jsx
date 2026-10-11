import { useState } from "react";
import { useSelector } from "react-redux";

import axios from "axios";
import Cookies from "js-cookie";
import moment from "moment";

import Button from "react-bootstrap/Button";
import Image from "react-bootstrap/Image";
import Modal from "react-bootstrap/Modal";
import "../../style/single post/SingleComment.scss";

import backendBaseURL from "../../backendBaseURL.js";
import logger from '../../utils/logger.js';


function SingleComment(props) {

	// ============================================================
	// Get Comment Details - starts
	// ============================================================

	const comment = props.comment;

	// ============================================================
	// Get Comment Details - ends
	// ============================================================



	// ============================================================
	// Redux - starts
	// ============================================================

	const user = useSelector((user) => user.userSlice.userDetail);

	// ============================================================
	// Redux - ends
	// ============================================================


	
	// ============================================================
	// Comment Modal And Edit State - starts
	// ============================================================

	const [showDeleteComment, setShowDeleteComment] = useState(false); 
	const [commentEdit, setCommentEdit] = useState(false);
	const [updatedComment, setUpdatedComment] = useState(comment.commentDescription);

	// ============================================================
	// Comment Modal And Edit State - ends
	// ============================================================



	// ============================================================
	// Comment Update State - starts
	// ============================================================

	const [commentUpdateIsError, setCommentUpdateIsError] = useState(false);
	const [commentUpdateSuccessMessage, setCommentUpdateSuccessMessage] =useState(null);
	const [commentUpdateErrorMessage, setCommentUpdateErrorMessage] =useState(null);
	const [isCommentUpdated, setIsCommentUpdated] = useState(false);

	// ============================================================
	// Comment Update State - ends
	// ============================================================



	// ============================================================
	// Initialize Comment API State Variables - starts
	// ============================================================
	
	const [isUpdatingComment, setIsUpdatingComment] = useState(false);
	const [isDeletingComment, setIsDeletingComment] = useState(false);

	// ============================================================
	// Initialize Comment Update API State Variables - ends
	// ============================================================



	// ============================================================
	// Check Comment Ownership - starts
	// ============================================================

	let isUserOwnComment;

	if (user !== null && user.userID == comment.userID) {
		isUserOwnComment = true;
	}
	else {
		isUserOwnComment = false;
	}

	// ============================================================
	// Check Comment Ownership - ends
	// ============================================================



	// ============================================================
	// Handle Comment Change - starts
	// ============================================================

	function handleCommentChangeHandler(event) {
		setUpdatedComment(event.target.value);
	}

	// ============================================================
	// Handle Comment Change - ends
	// ============================================================



	// ============================================================
	// Update Comment - starts
	// ============================================================

	async function handleUpdateComment(event) {
		event.preventDefault();
		
		if(isUpdatingComment){
			return;
		}

		// Get authentication details for updating the comment
		const token = Cookies.get("jwt_access_token");
		const userID = user.userID;

		const values = { 
			userID, 
			updatedComment 
		};

		// Get the comment ID from either available property
		const commentID = comment.commentID || comment._id;

		try {
			setIsUpdatingComment(true);

			// Send the updated comment to the backend
			logger.log("Updating comment:", values);
			const response = await axios.put(
				`${backendBaseURL}/api/blogPost/comment/updateComment/${commentID}`,
				values,
				{
					headers: {
						Authorization: `Bearer ${token}`
					}
				}
			);
			logger.log("Comment updated:", response);

			const updateCommentResponse = response.data;
			if(updateCommentResponse.success){
				setCommentUpdateSuccessMessage(updateCommentResponse.successMessage);
				setCommentUpdateErrorMessage(null);
				setCommentUpdateIsError(false);

				// Close edit mode after displaying the success message
				setTimeout(() => {
					setCommentEdit(false);
					// Mark the comment as updated after the edit mode closes
					setTimeout(() => {
						setIsCommentUpdated(true);
					}, 1000);
				}, 2000);
			}
			
		} 
		catch (error) {
			logger.error("Error while updating comment:", error);

			const errorResponse = error?.response?.data;
			const statusCode = error?.response?.status;

			if (errorResponse?.error) {
				let errorMessage = errorResponse?.errorData?.errorMessage;
				if (statusCode === 401) {
					setCommentUpdateErrorMessage(errorResponse?.errorData?.errorMessage);
				} 
				else if (statusCode === 406) {
					setCommentUpdateErrorMessage(errorResponse?.errorData?.errorMessage);
				} 
				else {
					setCommentUpdateErrorMessage(errorResponse?.errorData?.errorMessage);
				}
				setCommentUpdateSuccessMessage(null);
				setCommentUpdateIsError(true);
			}
			else {
				setCommentUpdateErrorMessage(error?.message);
				setCommentUpdateSuccessMessage();
				setCommentUpdateIsError(true);
			}
		}
		finally {
			setIsUpdatingComment(false);
		}
	}

	// ============================================================
	// Update Comment - ends
	// ============================================================



	// ============================================================
	// Delete Comment - starts
	// ============================================================

	async function handleCommentDelete() {
		if(isDeletingComment){
			return;
		}

		// Get authentication details for deleting the comment
		const token = Cookies.get("jwt_access_token");
		const userID = user.userID;


		// Get the comment ID from either available property
		const commentID = comment.commentID || comment._id;
		try {
			setIsDeletingComment(true);

			// Send delete request for the selected comment
			const response = await axios.delete(
				`${backendBaseURL}/api/blogPost/comment/deleteComment/${commentID}`,
				{
					headers: {
						Authorization: `Bearer ${token}`
					}
				}
			);
			logger.log("Comment deleted:", response);

			// Close the delete confirmation modal
			setShowDeleteComment(false);

			// Refresh comments after successfully deleting the comment
			if (props.refetchComments) {
				props.refetchComments();
			}
		} catch (error) {
			logger.error("Error while deleting comment:", error);
			logger.error("Error response data:", error.response.data);
		}
		finally {
			setIsDeletingComment(false);
		}
	}

	// ============================================================
	// Delete Comment - ends
	// ============================================================




	// ============================================================
    // JSX Section - starts
    // ============================================================
	
	return (
		<>
			<div className="modern-single-comment">
				<div className="comment-top">
					<div className="comment-user">
						<Image
							src={comment.userDetails.userProfilePhoto}
							roundedCircle
							className="comment-avatar"
						/>

						<div className="comment-user-info">
							<h5>{comment.userDetails.fullName}</h5>

							<span>@{comment.userDetails.username}</span>
						</div>
					</div>

					<div className="comment-date">
						{isCommentUpdated ? (
							<span>now</span>
						) : (
							<span>{moment(comment.commentDateTime).fromNow()}</span>
						)}
					</div>
				</div>

				<div className="comment-body">
					{isCommentUpdated ? (
						<p>{updatedComment}</p>
					) : (
						<p>{comment.commentDescription}</p>
					)}
				</div>

				{isUserOwnComment && (
					<div className="comment-actions">
						<Button
							variant="outline-primary"
							size="sm"
							onClick={function () {
								setCommentEdit(true);
							}}
						>
							Edit
						</Button>

						<Button
							variant="outline-danger"
							size="sm"
							onClick={function () {
								setShowDeleteComment(true);
							}}
						>
							Delete
						</Button>
					</div>
				)}
			</div>

			{commentEdit && (
				<div className="modern-edit-comment">
					<h5>Edit Comment</h5>

					<form>
						<textarea
							rows="4"
							value={updatedComment}
							onChange={handleCommentChangeHandler}
							placeholder="Update your comment..."
						/>

						<div className="edit-comment-buttons">
							<Button 
								onClick={handleUpdateComment}
								disabled={isUpdatingComment}
							>
								{isUpdatingComment ? "Updating..." : "Update Comment"}
							</Button>
						</div>

						{commentUpdateIsError ? (
							<div className="comment-error-message">
								<p>{commentUpdateErrorMessage}</p>
							</div>
						) : (
							commentUpdateSuccessMessage && (
								<div className="comment-success-message">
									<p>{commentUpdateSuccessMessage}</p>
								</div>
							)
						)}
					</form>
				</div>
			)}

			<Modal
				show={showDeleteComment}
				onHide={function () {
					setShowDeleteComment(false);
				}}
				centered
			>
				<Modal.Header closeButton>
					<Modal.Title>Delete Comment</Modal.Title>
				</Modal.Header>

				<Modal.Body>
					Are you sure you want to delete this comment?
				</Modal.Body>

				<Modal.Footer>
					<Button
						variant="secondary"
						onClick={function () {
							setShowDeleteComment(false);
						}}
					>
						Cancel
					</Button>

					<Button 
						variant="danger" 
						onClick={handleCommentDelete} 
						disabled={isDeletingComment}
					>
						{isDeletingComment ? "Deleting..." : "Delete"}
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	);
	
	// ============================================================
    // JSX Section - ends
    // ============================================================

}

export default SingleComment;
