import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export function SortableItem({ image, id, title }) {
  const {
    attributes,
    isDragging,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    id,
    transition: {
      duration: 300,
      easing: "cubic-bezier(0.25, 1, 0.5, 1)",
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    height: "100%",
    // // width: "100%",
    backgroundColor: "lightcoral",
    opacity: isDragging ? 0 : 1,
    // border: isDragging ? "2px solid black" : "0px solid red",
  };

  return (
    <div>
      <div ref={setNodeRef} className="SortableItem" style={style}>
        <img
          className="SortableItemImage"
          {...attributes}
          {...listeners}
          src={`https://image.tmdb.org/t/p/w200/${image}`}
        />
        <div>{title}</div>
        <button onClick={() => props.deleteMovie(id)}>del</button>
      </div>
    </div>
  );
}
