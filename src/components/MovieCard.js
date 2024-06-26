import { useEffect, useState } from 'react'
import '../App.css'
import LikeIcon from '../LikeIcon';
import DislikeIcon from '../DislikeButton';

export default function MovieCard(props) {
    const [likesRatio, setLikesRatio] = useState(0)
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
    const [showTooltipLike, setShowTooltipLike] = useState(false);
    const [showTooltipDislike, setShowTooltipDislike] = useState(false)
    const [liked, setLiked] = useState(false)
    const [disliked, setDisliked] = useState(false)

    /**
     * Hook to compute the ratio of likes and dislikes
     */
    useEffect(() => {
        setLikesRatio(Math.floor(props.likes / (props.likes + props.dislikes) * 100))
    }, [props.likes, props.dislikes])

    /**
     * Function to set the behavior when the likes/dislikes bar is hovered
     * @param {*} e - events
     * @param {string} type - either 'like' or 'dislike'; defines which is hovered
     */
    const handleMouseEnter = (e, type) => {
        setTooltipPosition(
            {
                x: e.clientX,
                y: e.clientY + 5
            });
        if (type === 'like') {
            setShowTooltipLike(true);
        } else {
            setShowTooltipDislike(true)
        }
    };

    /**
     * Function to set the behavior when the likes/dislikes bar is not hovered anymore
     */
    const handleMouseLeave = () => {
        setShowTooltipLike(false);
        setShowTooltipDislike(false)
    };

    /**
     * Function to handle the behavior when the movie is liked
     */
    const handleLiked = () => {
        setLiked(prevState => !prevState)
        console.log('handleLiked')
        setDisliked(false)
        props.onLike(liked, disliked)
    }

    /**
     * Function to handle the behavior when the movie is liked
     */
    const handleDisliked = () => {
        setDisliked(prevState => !prevState)
        setLiked(false)
        props.onDislike(liked, disliked)
    }
    return (
        <div className="Movie-Card">
            <div className='Card-Header'>
                <button onClick={props.onDelete}>X</button>
            </div>
            <label style={{ fontWeight: 'bold', alignSelf: 'center' }}>{props.title}</label>
            <label>{props.category}</label>
            <div className='Appreciation-Container'>
                <div className='Appreciation'>
                    <div onMouseEnter={e => handleMouseEnter(e, 'like')} onMouseLeave={handleMouseLeave} className='Tooltip' style={{ height: '100%', width: likesRatio.toString() + '%', backgroundColor: 'green', borderRadius: likesRatio !== 100 ? '4px 0 0 4px' : '4px 4px 4px 4px' }}>
                        {showTooltipLike && <span style={{ left: tooltipPosition.x, top: tooltipPosition.y }} className="TooltipText">{props.likes}</span>}
                    </div>
                    <div onMouseEnter={e => handleMouseEnter(e, 'dislike')} onMouseLeave={handleMouseLeave} className='Tooltip' style={{ height: '100%', width: (100 - likesRatio).toString() + '%', backgroundColor: 'red', borderRadius: likesRatio !== 0 ? '0 4px 4px 0' : '4px 4px 4px 4px' }}>
                        {showTooltipDislike && <span style={{ left: tooltipPosition.x, top: tooltipPosition.y }} className="TooltipText">{props.dislikes}</span>}
                    </div>
                </div>
                <div className='Button-Container'>
                    <div className="Button-Wrapper" onClick={handleLiked}>
                        <LikeIcon height="40px" width="40px" fill={liked ? "green" : "black"} />
                    </div>
                    <div className="Button-Wrapper" onClick={handleDisliked}>
                        <DislikeIcon height="40px" width="40px" fill={disliked ? "red" : "black"} />
                    </div>
                </div>
            </div>
        </div>
    )
}