import { computed, ComputedRef } from "vue";
import {
  removeCartItem,
  changeCartItemQuantity,
  getProduct,
} from "@shopware-pwa/shopware-6-client";
import {
  Product,
  LineItem,
  LineItemType,
  ClientApiError,
  PropertyGroupOption,
} from "@shopware-pwa/types";
// import {
//   getApplicationContext,
//   useDefaults,
//   useCart,
// } from "@shopware-pwa/composables";

import { getMainImageUrl } from "@shopware-pwa/helpers-next";
import { useShopwareContext, useCart } from ".";

/**
 * interface for {@link useCartItem} composable
 *
 * @beta
 */
export interface IUseCartItem {
  lineItem: ComputedRef<LineItem | undefined | null>;
  itemRegularPrice: ComputedRef<number | undefined>;
  itemSpecialPrice: ComputedRef<number | undefined>;
  itemImageThumbnailUrl: ComputedRef<string>;
  itemOptions: ComputedRef<Array<{ group: string; option: string }>>;
  itemType: ComputedRef<LineItemType | undefined>;
  isProduct: ComputedRef<boolean>;
  isPromotion: ComputedRef<boolean>;
  itemStock: ComputedRef<number | undefined>;

  itemQuantity: ComputedRef<number | undefined>;
  changeItemQuantity: (quantity: number) => Promise<void>;
  removeItem: () => Promise<void>;
  getProductItemSeoUrlData(): Promise<Partial<Product>>;
}

/**
 * Composable for cart item management. Options - {@link IUseCartItem}
 *
 * @beta
 */
export function useCartItem({
  cartItem,
}: {
  cartItem: LineItem;
}): IUseCartItem {
  if (!cartItem) {
    throw new Error("[useCartItem] mandatory cartItem argument is missing.");
  }
  const COMPOSABLE_NAME = "useCartitem";
  const contextName = COMPOSABLE_NAME;

  const { apiInstance } = useShopwareContext();
  const { refreshCart, broadcastUpcomingErrors } = useCart();
  // const { getDefaults } = useDefaults({
  //   defaultsKey: COMPOSABLE_NAME,
  // });

  const itemQuantity = computed(() => cartItem.quantity);
  const itemImageThumbnailUrl = computed(() =>
    getMainImageUrl(cartItem as any)
  );

  // TODO: use helper instead

  const itemRegularPrice = computed(
    () => cartItem.price?.listPrice?.price || cartItem.price?.unitPrice
  );

  const itemSpecialPrice = computed(
    () => cartItem.price?.listPrice && cartItem.price.unitPrice
  );

  const itemOptions = computed(
    () =>
      (cartItem.type === "product" &&
        ((cartItem.payload as Product)?.options as unknown as Array<{
          group: string;
          option: string;
        }>)) ||
      []
  );

  const itemStock = computed(() => cartItem.deliveryInformation?.stock);

  const itemType = computed(() => cartItem.type);

  const isProduct = computed(() => cartItem.type === "product");

  const isPromotion = computed(() => cartItem.type === "promotion");

  async function removeItem() {
    const result = await removeCartItem(cartItem.id, apiInstance);
    broadcastUpcomingErrors(result);
    refreshCart();
  }

  async function changeItemQuantity(quantity: number): Promise<void> {
    const result = await changeCartItemQuantity(
      cartItem.id,
      quantity,
      apiInstance
    );
    broadcastUpcomingErrors(result);
    refreshCart();
  }

  async function getProductItemSeoUrlData(): Promise<Partial<Product>> {
    if (!cartItem.referencedId) {
      return {};
    }

    try {
      const result = await getProduct(
        cartItem.referencedId,
        {
          // includes: (getDefaults() as any).getProductItemsSeoUrlsData.includes,
          // associations: (getDefaults() as any).getProductItemsSeoUrlsData
          //   .associations,
        },
        apiInstance
      );
      return result.product;
    } catch (error) {
      console.error(
        "[useCart][getProductItemsSeoUrlsData]",
        (error as ClientApiError).messages
      );
    }

    return {};
  }

  return {
    changeItemQuantity,
    removeItem,
    getProductItemSeoUrlData,
    lineItem: computed(() => cartItem),
    itemRegularPrice,
    itemSpecialPrice,
    itemOptions,
    itemStock,
    itemQuantity,
    itemType,
    itemImageThumbnailUrl,
    isProduct,
    isPromotion,
  };
}
