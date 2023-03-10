import moment from "moment";
import Like from "../like/Like";

const SinglePostElement = (props) => {
  // seed is the random seed to generate random avatars
  const seed = Math.round(Math.random() * 100);
  // timeAgo uses momentjs to generate a time from now string e.g "4 minutes ago"
  const timeAgo = moment(new Date(props.createdAt)).fromNow();

  return (
    <>
      {/* div container for the whole post */}
      <div data-cy="post" class="container mx-auto max-w-lg" key={props.id}>
        {/* div container for user photo, full name, username, time of post */}
        <div class="flex flex-shrink-0 p-4 pb-0">
          <a href="#" class="group block flex-shrink-0">
            <div class="flex items-center">
              <div>
                <img
                  id="user-photo"
                  class="inline-block h-10 w-10 rounded-full"
                  // This is the link to the image of a user on their post
                  src={props.photoUrl}
                  alt=""
                />
              </div>
              <div class="ml-3">
                {/* Here we can add the user's first and last name */}
                <p id="user-fullname" class="text-base font-medium leading-6">
                  {props.firstName} {props.lastName}
                </p>
                {/* Here we can add the user's username */}
                {/* <p
                  id="username"
                  class="text-sm font-medium leading-5 text-gray-400 transition duration-150 ease-in-out group-hover:text-gray-300"
                >
                  @username
                </p> */}
              </div>
            </div>
          </a>
        </div>

        <div className="pl-16">
          {/* post content appears here */}
          <p className="flex-shrink text-base font-medium width-auto">
            {props.message}
            <span className="text-blue-400">#mineshaft</span>
          </p>
          {/* Uncomment code below if you want to add an image */}
          {/* <div className="pt-3 pr-6 md:flex-shrink">
        <img
          className="w-full h-64 rounded-lg"
          src="https://www.thecoderpedia.com/wp-content/uploads/2020/06/Programming-Memes-Programmer-while-sleeping.jpg"
        />
           </div> */}
          {/* end of the image */}
          {/* - - - - - - - -  */}
          <p
            id="time-ago"
            className="text-sm font-medium leading-5 text-gray-400 transition duration-150 ease-in-out group-hover:text-gray-300"
          >
            {timeAgo}
          </p>

          {/* div container for like and comment buttons below*/}
          <div class="flex w-full flex items-center">
            {/* Like button start*/}

            <Like postId={props.id} />
            {/* Like button end */}

            {/* Comment button start*/}
            <div
              id="comment-button"
              className="flex text-center"
              data-cy="commentButton"
              onClick={props.toggleComments}
            >
              {/* Add the code to comment on post */}
              <a className="flex items-center w-12 px-3 py-2 mt-1 text-base font-medium leading-6 text-gray-500 rounded-full group hover:bg-blue-800 hover:text-blue-300">
                <svg
                  className="w-6 h-6 text-center"
                  fill="none"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                </svg>
              </a>
            </div>
            {/* Comment button end*/}
          </div>
        </div>
      </div>
    </>
  );
};

export default SinglePostElement;
