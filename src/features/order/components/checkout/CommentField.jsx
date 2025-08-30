export const CommentField = ({ comment, setComment }) => (
  <div className="field-wrapper">
    <label htmlFor="comment" className="field-label">Комментарий к заведению</label>
    <textarea id="comment" rows="3" className="text-field" value={comment} onChange={(e) => setComment(e.target.value)} />
  </div>
);


