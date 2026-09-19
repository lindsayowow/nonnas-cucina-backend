import { useCallback } from "react";

export default function useFavoriteToggle(orders, setOrders, token) {

  const toggleFavorite = useCallback(async (orderId, dishId) => {
    let newValue;

    const updatedOrders = orders.map(order => {
      // CASE 1: PastOrders shape - { id, dishes: [...] }
      if (order.dishes) {
        if (order.id !== orderId) return order;

        const updatedDishes = order.dishes.map(dish => {
          if (dish.id !== dishId) return dish;
          newValue = !dish.isFavorite;
          return { ...dish, isFavorite: newValue };
        });

        return { ...order, dishes: updatedDishes };
      }

      // CASE 2: Favorites shape - flat dish list
      if (order.id === dishId) {
        newValue = !order.isFavorite;
        return { ...order, isFavorite: newValue };
      }

      return order;
    });

    if (newValue === undefined) {
      // Couldn't locate the target dish -- nothing to toggle
      return;
    }

    const previousOrders = orders;
    setOrders(updatedOrders);

    try {
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
        // Request failed -- roll back the optimistic update
        setOrders(previousOrders);
      }
    } catch {
      // Network error -- roll back the optimistic update
      setOrders(previousOrders);
    }
  }, [orders, setOrders, token]);

  return { toggleFavorite };
}