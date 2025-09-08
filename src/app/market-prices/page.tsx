
"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowDown, ArrowUp } from "lucide-react";
import { useFarm } from "@/contexts/farm-context";

export default function MarketPricesPage() {
  const { selectedFarm } = useFarm();
  
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
       <div className="mx-auto grid w-full max-w-4xl items-start gap-6">
        <div className="text-center">
            <h1 className="text-3xl font-bold md:text-4xl font-headline">Market Prices</h1>
            <p className="text-muted-foreground mt-2">
                Track live mandi prices for various crops in your region.
            </p>
        </div>
        <Card>
            <CardHeader>
                <CardTitle>Today's Mandi Rates for {selectedFarm.name}</CardTitle>
                <CardDescription>Prices from {selectedFarm.location}, per quintal (100 kg).</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>Crop</TableHead>
                    <TableHead>Market</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {selectedFarm.crops.map((item) => (
                    <TableRow key={`${item.name}-${selectedFarm.location}`}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>{selectedFarm.location}</TableCell>
                        <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                            <span>₹{item.price.toLocaleString("en-IN")}</span>
                            {item.trend === "up" ? (
                                <Badge variant="default" className="bg-green-500/20 text-green-700 hover:bg-green-500/30 dark:bg-green-500/10 dark:text-green-400">
                                    <ArrowUp className="h-3 w-3" />
                                </Badge>
                            ) : (
                                <Badge variant="destructive" className="bg-red-500/20 text-red-700 hover:bg-red-500/30 dark:bg-red-500/10 dark:text-red-400">
                                    <ArrowDown className="h-3 w-3" />
                                </Badge>
                            )}
                        </div>
                        </TableCell>
                    </TableRow>
                    ))}
                </TableBody>
                </Table>
            </CardContent>
        </Card>
      </div>
    </main>
  );
}
