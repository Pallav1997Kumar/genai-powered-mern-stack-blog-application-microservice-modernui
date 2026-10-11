import { useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

import axios from "axios";
import Cookies from "js-cookie";
import DOMPurify from "dompurify";

import Button from "react-bootstrap/Button";
import Image from "react-bootstrap/Image";
import Modal from "react-bootstrap/Modal";
import "../../style/single post/SingleOnlyPostSection.scss";

import LikedBy from "./LikedBy.jsx";
import AIGeneratedContent from "./ai components/AIGeneratedContent.jsx";

import backendBaseURL from "../../backendBaseURL.js";
import logger from '../../utils/logger.js';


function SingleOnlyPostSection(props) {
	
	// ============================================================
	// Navigation - starts
	// ============================================================

	const navigate = useNavigate();

	// ============================================================
	// Navigation - ends
	// ============================================================



	// ============================================================
	// Get Blog Post Details From Props - starts
	// ============================================================

	const {
		singlePost,
		isUserOwnPost,
		fullDate,
		blogPostID
	} = props;

	// ============================================================
	// Get Blog Post Details From Props - ends
	// ============================================================



	// ============================================================
	// Fetch Blog Post Like Users On Post Change - starts
	// ============================================================

	useEffect(function(){
		// Fetch the users who liked the blog post
		fetchBlogPostLikeUserList();
	}, [blogPostID]);

	// ============================================================
	// Fetch Blog Post Like Users On Post Change - ends
	// ============================================================

	

	// ============================================================
	// Redux - starts
	// ============================================================

	// Get logged-in user details from Redux store
	const user = useSelector((user) => user.userSlice.userDetail);

	// ============================================================
	// Redux - ends
	// ============================================================



	// ============================================================
	// Blog Post State - starts
	// ============================================================

	const [blogPostLikedList, setBlogPostLikedList] = useState(null);

	const [showDeletePost, setShowDeletePost] = useState(false);

	const [postDeleteErrorMessage, setPostDeleteErrorMessage] = useState(null);
	const [postDeleteSuccessMessage, setPostDeleteSuccessMessage] = useState(null);

	const [userLikedThisPost, setUserLikedThisPost] = useState(false);

	const [isLikingPost, setIsLikingPost] = useState(false);
	const [isUnlikingPost, setIsUnlikingPost] = useState(false);
	const [isDeletingPost, setIsDeletingPost] = useState(false);

	// ============================================================
	// Blog Post State - ends
	// ============================================================



	// ============================================================
	// Check User Like Status - starts
	// ============================================================

	useEffect(function() {
		if (user && blogPostLikedList) {
			// Check whether the logged-in user has liked this blog post
			const userLikeDetail = blogPostLikedList.filter(function (likeElement) {
				return likeElement.userID == user.userID;
			});
			setUserLikedThisPost(userLikeDetail.length > 0);
		}
	}, [user, blogPostLikedList]);

	// ============================================================
	// Check User Like Status - ends
	// ============================================================



	// ============================================================
	// Handle Blog Post Like - starts
	// ============================================================

	async function handleLikeBlogPost() {
		if(isLikingPost){
			return;
		}

		// Get authentication token from cookies
		const token = Cookies.get("jwt_access_token");

		try {
			setIsLikingPost(true);

			// Add a like for the current blog post
			const response = await axios.post(
				`${backendBaseURL}/api/blogPost/blogPostLike/like/newLike/${blogPostID}`,
				{},
				{
					headers: {
						Authorization: `Bearer ${token}`
					}
				}
			);
			logger.log("Blog post liked:", response);

			const postLikeResponse = response.data;
			if(postLikeResponse.success){
				setUserLikedThisPost(true);
			}
			
		} 
		catch (error) {
			logger.error("Error while liking blog post:", error);
		}
		finally{
			// Refresh the list of users who liked the post
			fetchBlogPostLikeUserList();
			setIsLikingPost(false);
		}
	}

	// ============================================================
	// Handle Blog Post Like - ends
	// ============================================================



	// ============================================================
	// Handle Blog Post Unlike - starts
	// ============================================================

	async function handleUnlikeBlogPost() {
		if(isUnlikingPost){
			return;
		}

		// Get authentication token from cookies
		const token = Cookies.get("jwt_access_token");

		try {
			setIsUnlikingPost(true);

			// Remove the current user's like from the blog post
			const response = await axios.delete(
				`${backendBaseURL}/api/blogPost/blogPostLike/unlikePost/${blogPostID}`,
				{
					headers: {
						Authorization: `Bearer ${token}`
					}
				}
			);
			logger.log("Blog post like removed:", response);

			const postUnlikeResponse = response.data;
			if(postUnlikeResponse.success){
				setUserLikedThisPost(false);
			}

		} 
		catch (error) {
			logger.error("Error while removing blog post like:", error);
		}
		finally{
			// Refresh the list of users who liked the post
			fetchBlogPostLikeUserList();
			setIsUnlikingPost(false);
		}
	}

	// ============================================================
	// Handle Blog Post Unlike - ends
	// ============================================================



	// ============================================================
	// Fetch Blog Post Like User List - starts
	// ============================================================

	async function fetchBlogPostLikeUserList() {
		try {
			// Fetch all users who have liked the current blog post
			const response = await axios.get(
				`${backendBaseURL}/api/blogPost/blogPostLike/${blogPostID}`
			);
			logger.log("Blog post like user list fetched:", response);

			const blogPostLikeResponse = response.data;

			if(blogPostLikeResponse.success){
				const blogPostLikeList = blogPostLikeResponse.resultData;
				setBlogPostLikedList(blogPostLikeList);
			}
		} catch (error) {
			logger.error("Error while fetching blog post like user list:", error);
		}
	}

	// ============================================================
	// Fetch Blog Post Like User List - ends
	// ============================================================



	// ============================================================
	// Delete Blog Post - starts
	// ============================================================

	async function handleDeleteBlogPost() {
		if(isDeletingPost){
			return;
		}

		// Get authentication token from cookies
		const token = Cookies.get("jwt_access_token");

		try {
			setIsDeletingPost(true);

			// Delete the selected blog post
			const response = await axios.delete(
				`${backendBaseURL}/api/blogPost/deletePost/${blogPostID}`,
				{
					headers: {
						Authorization: `Bearer ${token}`
					}
				}
			);
			logger.log("Blog post deleted:", response);

			setPostDeleteSuccessMessage(response);
			setPostDeleteErrorMessage(null);

			// Navigate to the home page after deleting the post
			navigate("/");
		} catch (error) {
			logger.error("Error while deleting blog post:", error);
			logger.error("Error response data:", error.response.data);
		}
		finally {
			setIsDeletingPost(false);
		}
	}

	// ============================================================
	// Delete Blog Post - ends
	// ============================================================




	// ============================================================
    // JSX Section - starts
    // ============================================================

	return (
		<>
			<div className="modern-single-post">
				{/* Hero Image */}
				<div className="post-hero-image">
					<img src={singlePost.postImage} alt={singlePost.postTitle} />
				</div>

				{/* Title */}
				<h1 className="post-title">{singlePost.postTitle}</h1>

				{/* Author Row */}
				<div className="post-meta-row">
					<div className="author-section">
						<Image
							src={singlePost.userDetails.userProfilePhoto}
							roundedCircle
							className="author-image"
						/>

						<div className="author-details">
							<h4>{singlePost.userDetails.fullName}</h4>

							<p>
								Category :
								<span>
									{singlePost.categoryDetails.categoryName}
								</span>
							</p>
						</div>
					</div>

					<div className="post-date">
						<i className="bi bi-calendar3"></i>

						<span>Posted on {fullDate}</span>
					</div>
				</div>

				{/* Update Delete */}

				{isUserOwnPost && (
					<div className="post-action-buttons">
						<Link
							to={`/blogs/updatePost/postId/${singlePost._id}`}
							state={{ blogDetails: singlePost }}
						>
							<Button variant="warning" className="update-btn">
								Update Post
							</Button>
						</Link>

						<Button
							variant="danger"
							className="delete-btn"
							onClick={function () {
								setShowDeletePost(true);
							}}
						>
							Delete Post
						</Button>
					</div>
				)}

				{/* Like Section */}

				<div className="like-section">
					{user ? (
						<div className="like-button-area">
							{userLikedThisPost ? (
								<Button 
									className="like-btn" 
									onClick={handleUnlikeBlogPost}
									disabled={isUnlikingPost || isLikingPost}
								>
									{isUnlikingPost ? "Unliking..." : "❤ Unlike Post"}
								</Button>
							) : (
								<Button 
									className="like-btn" 
									onClick={handleLikeBlogPost} 
									disabled={isLikingPost || isUnlikingPost}
								>
									{isLikingPost ? "Liking..." : "♡ Like The Post"}
								</Button>
							)}
						</div>
					) : (
						<div></div>
					)}

					<div className="liked-user-area">
						<LikedBy blogPostLikedList={blogPostLikedList} />
					</div>
				</div>

				{/* Description */}

				<div
					className="post-content"
					dangerouslySetInnerHTML={{
						__html: DOMPurify.sanitize(singlePost.postDescription),
					}}
				/>

				{/* AI Content */}

				<div className="ai-content-wrapper">
					<AIGeneratedContent
						postDescription={singlePost.postDescription}
					/>
				</div>
			</div>

			{postDeleteErrorMessage && (
				<div>
					<p className="error-message">{postDeleteErrorMessage}</p>
				</div>
			)}

			<Modal
				show={showDeletePost}
				onHide={function () {
					setShowDeletePost(false);
				}}
				centered
			>
				<Modal.Header closeButton>
					<Modal.Title>Delete Post</Modal.Title>
				</Modal.Header>

				<Modal.Body>Are you sure you want to delete this post?</Modal.Body>

				<Modal.Footer>
					<Button
						variant="secondary"
						onClick={function () {
							setShowDeletePost(false);
						}}
					>
						Cancel
					</Button>

					<Button 
						variant="danger" 
						onClick={handleDeleteBlogPost}
						disabled={isDeletingPost}
					>
						{isDeletingPost ? "Deleting..." : "Delete"}
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	);

	// ============================================================
    // JSX Section - ends
    // ============================================================

}

export default SingleOnlyPostSection;
