import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";

import Cookies from "js-cookie";
import axios from "axios";

import "../../style/single post/CommentSection.scss";

import Button from "react-bootstrap/Button";

import SingleComment from "./SingleComment";

import backendBaseURL from "../../backendBaseURL.js";
import logger from '../../utils/logger.js';


function CommentSection(props) {

	// ============================================================
	// Get Blog Post ID - starts
	// ============================================================

	const blogPostID = props.blogPostID;

	// ============================================================
	// Get Blog Post ID - ends
	// ============================================================



	// ============================================================
	// Fetch Comments On Blog Post Change - starts
	// ============================================================

	useEffect(function () {
		// Fetch comments whenever the blog post ID changes
		fetchBlogPostComment();
	}, [blogPostID]);
	
	// ============================================================
	// Fetch Comments On Blog Post Change - ends
	// ============================================================



	// ============================================================
	// Redux - starts
	// ============================================================

	// Get logged-in user details from Redux store
	const user = useSelector(function (state) {
		return state.userSlice.userDetail;
	});

	// ============================================================
	// Redux - ends
	// ============================================================



	// ============================================================
	// Blog Post Comment State - starts
	// ============================================================

	const [blogPostAllComments, setBlogPostAllComments] = useState(null);
	const [newComment, setNewComment] = useState("");

	const [commentAddIsError, setCommentAddIsError] = useState(false);
	
	const [commentAddedSuccessMessage, setCommentAddedSuccessMessage] = useState(null);
	const [commentAddedErrorMessage, setCommentAddedErrorMessage] = useState(null);
	
	const [isAddingComment, setIsAddingComment] = useState(false);

	// ============================================================
	// Blog Post Comment State - ends
	// ============================================================
	


	// ============================================================
	// Handle Comment Input Change - starts
	// ============================================================

	function handleCommentChangeHandler(event) {
		setNewComment(event.target.value);
	}

	// ============================================================
	// Handle Comment Input Change - ends
	// ============================================================	



	// ============================================================
	// Fetch Blog Post Comments - starts
	// ============================================================

	async function fetchBlogPostComment() {
		try {

			// Fetch all comments for the selected blog post
			const response = await axios.get(
				`${backendBaseURL}/api/blogPost/comment/${blogPostID}`
			);
			logger.log("Fetched blog post comments:", response);

			const blogBlogCommentsResponse = response.data;

			if(blogBlogCommentsResponse.success){
				const blogPostAllComments = blogBlogCommentsResponse.resultData;
				setBlogPostAllComments(blogPostAllComments);
			}
		}
		catch (error) {
			logger.error("Error while fetching blog post comments:", error);
		}
	}

	// ============================================================
	// Fetch Blog Post Comments - ends
	// ============================================================



	// ============================================================
	// Add New Blog Post Comment - starts
	// ============================================================

	async function handleAddComment(event) {
		event.preventDefault();

		if(isAddingComment){
			return;
		}

		// Get authentication token from cookies
		const token = Cookies.get("jwt_access_token");

		const values = {
			newComment
		};

		try {
			setIsAddingComment(true);

			// Send the new comment to the backend
			logger.log("Adding new comment:", values);
			const response = await axios.post(
				`${backendBaseURL}/api/blogPost/comment/newComment/${blogPostID}`,
				values, 
				{
					headers: {
						Authorization: `Bearer ${token}`
					}
				}
			);
			logger.log("New comment added:", response);

			const addCommentResponse = response.data;
			if(addCommentResponse?.success){
				// Refresh the comments after successfully adding a comment
				await fetchBlogPostComment();

				// Clear the comment input field
				setNewComment("");

				// Reset error state and display success message
				setCommentAddIsError(false);
				setCommentAddedSuccessMessage(addCommentResponse.successMessage);
				setCommentAddedErrorMessage(addCommentResponse.errorMessage);
			}
		}
		catch (error) {
			logger.error("Error while adding new comment:", error);

			const errorResponse = error?.response?.data;
			const statusCode = error?.response?.status;

			if (errorResponse?.error) {
				if (statusCode === 401) {
					setCommentAddedErrorMessage(errorResponse?.errorData?.errorMessage);
				} 
				else if (statusCode === 406) {
					setCommentAddedErrorMessage(errorResponse?.errorData?.errorMessage);
				} 
				else {
					setCommentAddedErrorMessage(errorResponse?.errorData?.errorMessage);
				}
				setCommentAddIsError(true);
				setCommentAddedSuccessMessage(errorResponse?.successMessage);
			}
			else {
				setCommentAddedErrorMessage(error?.message);
				setCommentAddIsError(true);
				setCommentAddedSuccessMessage("");
			}

		}
		finally {
			setIsAddingComment(false);
		}

	}

	// ============================================================
	// Add New Blog Post Comment - ends
	// ============================================================
	



	// ============================================================
    // JSX Section - starts
    // ============================================================

	return (
		<div className="modern-comment-section">
			<div className="comment-card">
				<div className="comment-header">
					<h3>Discussion</h3>
					<span>
						{blogPostAllComments ? blogPostAllComments.length : 0}{" "}
						Comments
					</span>
				</div>

				{user ? (
					<div className="comment-editor">
						<form>
							<textarea
								rows="5"
								placeholder="Share your thoughts..."
								value={newComment}
								onChange={handleCommentChangeHandler}
							/>

							<div className="comment-submit">
								<Button
									onClick={handleAddComment}
									className="post-comment-btn"
									disabled={isAddingComment || !newComment.trim()}
								>
									{isAddingComment ? "Posting Comment..." : "Post Comment"}
								</Button>
							</div>

							{commentAddIsError ? (
								<div className="comment-error-message">
									<p>{commentAddedErrorMessage}</p>
								</div>
							) : (
								commentAddedSuccessMessage && (
									<div className="comment-success-message">
										<p>{commentAddedSuccessMessage}</p>
									</div>
								)
							)}
						</form>
					</div>
				) : (
					<div className="login-comment-card">
						<div className="login-icon">💬</div>
						<h5>Join the conversation</h5>
						<p>Please login to write a comment.</p>
						<Button className="login-btn">
							<NavLink to="/login" className="login-comment">
								Login
							</NavLink>
						</Button>
					</div>
				)}

				<div className="comment-list">
					<h4>Recent Comments</h4>

					{blogPostAllComments &&
						blogPostAllComments.map(function (blogPostEachComment) {
							return (
								<SingleComment
									key={blogPostEachComment._id}
									comment={blogPostEachComment}
									refetchComments={fetchBlogPostComment}
								/>
							);
						})}

					{blogPostAllComments && blogPostAllComments.length === 0 && (
						<div className="no-comments">
							No comments yet. Be the first to comment.
						</div>
					)}
				</div>
			</div>
		</div>
	);

	// ============================================================
    // JSX Section - ends
    // ============================================================


}

export default CommentSection;