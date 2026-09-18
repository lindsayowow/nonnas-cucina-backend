import { useCallback } from "react";

export default function useFavoriteToggle(orders, setOrders, token) {

  const toggleFavorite = useCallback(async (orderId, dishId) => {
    try {
      const updatedOrders = orders.map(order => {
        // CASE 1: PastOrders shape → { id, dishes: [...] }
        if (order.dishes) {
          const updatedDishes = order.dishes.map(dish => {
            if (dish.id !== dishId) return dish;
            return { ...dish, isFavorite: !dish.isFavorite };
          });

          return { ...order, dishes: updatedDishes };
        }

        // CASE 2: Favorites shape → flat dish list
        // Wrap each dish into a fake "order" so the hook logic stays consistent
        if (order.id === dishId) {
          return { ...order, isFavorite: !order.isFavorite };
        }

        return order;
      });

      setOrders(updatedOrders);

      // Determine newValue safely
      let newValue;

      // PastOrders shape
      const orderMatch = updatedOrders.find(o => o.id === orderId);
      if (orderMatch && orderMatch.dishes) {
        newValue = orderMatch.dishes.find(d => d.id === dishId)?.isFavorite;
      }

      // Favorites shape (flat dishes)
      if (newValue === undefined) {
        newValue = updatedOrders.find(d => d.id === dishId)?.isFavorite;
      }

      // Send update to backend
      const response = await fetch(
        `http://localhost:8080/dishes/${dishId}/favorite`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ isFavorite: newValue })
        }
      );

      if (!response.ok) {
        console.error("Failed to update favorite");
      }

    } catch (err) {
      console.error("Error updating favorite", err);
    }
  }, [orders, setOrders, token]);

  return { toggleFavorite };
}
