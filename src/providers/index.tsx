"use client";

import { ReactNode } from "react";
import { AuthProvider } from "@/contexts/auth-context";
import { CartProvider } from "@/contexts/cart-context";
import { WishlistProvider } from "@/contexts/wishlist-context";
import { ThemeProvider } from "@/contexts/theme-context";
import { ProductsProvider } from "@/contexts/products-context";
import { OrdersProvider } from "@/contexts/orders-context";
import { BlogsProvider } from "@/contexts/blogs-context";
import { SpinWheelProvider } from "@/contexts/spin-wheel-context";
import { MarketingProvider } from "@/contexts/marketing-context";
import { ReviewsProvider } from "@/contexts/reviews-context";
import { AddressesProvider } from "@/contexts/addresses-context";
import { StoreSettingsProvider } from "@/contexts/store-settings-context";
import { AppShell } from "@/components/app-shell";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <StoreSettingsProvider>
        <ProductsProvider>
          <BlogsProvider>
            <MarketingProvider>
              <ReviewsProvider>
                <AddressesProvider>
                  <SpinWheelProvider>
                    <OrdersProvider>
                      <CartProvider>
                        <WishlistProvider>
                          <AppShell>{children}</AppShell>
                        </WishlistProvider>
                      </CartProvider>
                    </OrdersProvider>
                  </SpinWheelProvider>
                </AddressesProvider>
              </ReviewsProvider>
            </MarketingProvider>
          </BlogsProvider>
        </ProductsProvider>
        </StoreSettingsProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
