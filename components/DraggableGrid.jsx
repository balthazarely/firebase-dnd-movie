import { DndContext, closestCenter, DragOverlay } from "@dnd-kit/core";
import {
  arrayMove,
  rectSortingStrategy,
  SortableContext,
} from "@dnd-kit/sortable";
import { SortableItem } from "components/SortableItem";
import { useState } from "react";

export default function DraggableGrid({ movies, setMovies, deleteMovie }) {
  const [activeId, setActiveId] = useState(null);

  function handleDragStart(event) {
    const foundItem = movies.find((movie) => movie.id === event.active.id);
    setActiveId(foundItem);
  }

  function handleDragEnd(event) {
    const { active, over } = event;
    if (active.id !== over.id) {
      setMovies((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

  return (
    <DndContext
      id="0"
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      onDragStart={handleDragStart}
    >
      <div>
        <SortableContext items={movies} strategy={rectSortingStrategy}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: " repeat(auto-fit, minmax(120px, 1fr))",
              gridGap: 10,
              padding: 10,
              gridAutoFlow: "row dense",
            }}
          >
            {movies.map((movie, idx) => (
              <SortableItem
                deleteMovie={deleteMovie}
                key={movie.id}
                id={movie.id}
                title={movie.movieTitle}
                image={movie.image}
              />
            ))}
          </div>
        </SortableContext>
        <DragOverlay>
          {activeId ? (
            <SortableItem
              key={activeId.id}
              id={activeId.id}
              title={activeId.movieTitle}
              image={activeId.image}
            />
          ) : null}
        </DragOverlay>
      </div>
    </DndContext>
  );
}
