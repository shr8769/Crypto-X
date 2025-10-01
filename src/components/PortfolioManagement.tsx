import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Plus, 
  Trash2, 
  Edit3, 
  TrendingUp, 
  TrendingDown, 
  Wallet,
  DollarSign,
  Calendar,
  StickyNote
} from "lucide-react";
import { PortfolioHolding } from '@/types/portfolio';
import { useCryptoPrices } from '@/hooks/useCryptoPrices';

interface PortfolioManagementProps {
  holdings: PortfolioHolding[];
  onAddHolding: (holding: Omit<PortfolioHolding, 'id'>) => void;
  onRemoveHolding: (holdingId: string) => void;
  onUpdateHolding: (holdingId: string, updates: Partial<PortfolioHolding>) => void;
}

const POPULAR_CRYPTOS = [
  { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin' },
  { id: 'ethereum', symbol: 'ETH', name: 'Ethereum' },
  { id: 'cardano', symbol: 'ADA', name: 'Cardano' },
  { id: 'solana', symbol: 'SOL', name: 'Solana' },
  { id: 'polygon', symbol: 'MATIC', name: 'Polygon' },
  { id: 'chainlink', symbol: 'LINK', name: 'Chainlink' },
  { id: 'avalanche-2', symbol: 'AVAX', name: 'Avalanche' },
  { id: 'polkadot', symbol: 'DOT', name: 'Polkadot' }
];

const PortfolioManagement = ({
  holdings,
  onAddHolding,
  onRemoveHolding,
  onUpdateHolding
}: PortfolioManagementProps) => {
  const { prices } = useCryptoPrices();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingHolding, setEditingHolding] = useState<PortfolioHolding | null>(null);
  
  const [formData, setFormData] = useState({
    cryptoId: '',
    symbol: '',
    name: '',
    quantity: '',
    averageBuyPrice: '',
    purchaseDate: new Date().toISOString().split('T')[0],
    notes: ''
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 6
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  const getCurrentPrice = (holding: PortfolioHolding) => {
    const crypto = prices.find(p => 
      p.id === holding.cryptoId || p.symbol.toLowerCase() === holding.symbol.toLowerCase()
    );
    return crypto?.price || 0;
  };

  const getHoldingPerformance = (holding: PortfolioHolding) => {
    const currentPrice = getCurrentPrice(holding);
    const currentValue = holding.quantity * currentPrice;
    const totalInvested = holding.totalInvested;
    const gainLoss = currentValue - totalInvested;
    const gainLossPercent = totalInvested > 0 ? (gainLoss / totalInvested) * 100 : 0;

    return {
      currentValue,
      gainLoss,
      gainLossPercent,
      currentPrice
    };
  };

  const handleCryptoSelect = (cryptoId: string) => {
    const crypto = POPULAR_CRYPTOS.find(c => c.id === cryptoId);
    if (crypto) {
      setFormData(prev => ({
        ...prev,
        cryptoId: crypto.id,
        symbol: crypto.symbol,
        name: crypto.name
      }));
    }
  };

  const resetForm = () => {
    setFormData({
      cryptoId: '',
      symbol: '',
      name: '',
      quantity: '',
      averageBuyPrice: '',
      purchaseDate: new Date().toISOString().split('T')[0],
      notes: ''
    });
    setEditingHolding(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.cryptoId || !formData.quantity || !formData.averageBuyPrice) {
      return;
    }

    const quantity = parseFloat(formData.quantity);
    const averageBuyPrice = parseFloat(formData.averageBuyPrice);
    const totalInvested = quantity * averageBuyPrice;

    const holdingData = {
      cryptoId: formData.cryptoId,
      symbol: formData.symbol,
      name: formData.name,
      quantity,
      averageBuyPrice,
      totalInvested,
      purchaseDate: new Date(formData.purchaseDate),
      notes: formData.notes
    };

    if (editingHolding) {
      onUpdateHolding(editingHolding.id, holdingData);
    } else {
      onAddHolding(holdingData);
    }

    setIsAddDialogOpen(false);
    resetForm();
  };

  const handleEdit = (holding: PortfolioHolding) => {
    setEditingHolding(holding);
    setFormData({
      cryptoId: holding.cryptoId,
      symbol: holding.symbol,
      name: holding.name,
      quantity: holding.quantity.toString(),
      averageBuyPrice: holding.averageBuyPrice.toString(),
      purchaseDate: holding.purchaseDate.toISOString().split('T')[0],
      notes: holding.notes || ''
    });
    setIsAddDialogOpen(true);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="w-5 h-5 text-primary" />
              Portfolio Holdings
            </CardTitle>
            <CardDescription>
              Manage your cryptocurrency investments
            </CardDescription>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
            setIsAddDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Crypto
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>
                  {editingHolding ? 'Edit' : 'Add'} Cryptocurrency
                </DialogTitle>
                <DialogDescription>
                  {editingHolding ? 'Update your cryptocurrency holding' : 'Add a new cryptocurrency to your portfolio'}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="crypto-select">Cryptocurrency</Label>
                  <Select 
                    value={formData.cryptoId} 
                    onValueChange={handleCryptoSelect}
                    disabled={!!editingHolding}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a cryptocurrency" />
                    </SelectTrigger>
                    <SelectContent>
                      {POPULAR_CRYPTOS.map((crypto) => (
                        <SelectItem key={crypto.id} value={crypto.id}>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{crypto.symbol}</Badge>
                            {crypto.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input
                      id="quantity"
                      type="number"
                      step="any"
                      placeholder="0.00"
                      value={formData.quantity}
                      onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="averageBuyPrice">Average Buy Price (USD)</Label>
                    <Input
                      id="averageBuyPrice"
                      type="number"
                      step="any"
                      placeholder="0.00"
                      value={formData.averageBuyPrice}
                      onChange={(e) => setFormData(prev => ({ ...prev, averageBuyPrice: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="purchaseDate">Purchase Date</Label>
                  <Input
                    id="purchaseDate"
                    type="date"
                    value={formData.purchaseDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, purchaseDate: e.target.value }))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes (Optional)</Label>
                  <Input
                    id="notes"
                    placeholder="Add any notes about this investment"
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  />
                </div>

                {formData.quantity && formData.averageBuyPrice && (
                  <div className="p-3 bg-muted/50 rounded-md">
                    <div className="flex items-center justify-between text-sm">
                      <span>Total Investment:</span>
                      <span className="font-semibold">
                        {formatCurrency(parseFloat(formData.quantity) * parseFloat(formData.averageBuyPrice))}
                      </span>
                    </div>
                  </div>
                )}

                <div className="flex justify-end space-x-2 pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsAddDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingHolding ? 'Update' : 'Add'} Holding
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {holdings.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Wallet className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No holdings in your portfolio</p>
            <p className="text-sm mt-1">Add your first cryptocurrency to get started</p>
          </div>
        ) : (
          <div className="space-y-4">
            {holdings.map((holding) => {
              const performance = getHoldingPerformance(holding);
              const isProfit = performance.gainLoss >= 0;
              
              return (
                <div
                  key={holding.id}
                  className="flex items-center justify-between p-4 border border-border/50 rounded-lg hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-semibold text-primary">
                        {holding.symbol.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold">{holding.name}</h4>
                        <Badge variant="outline">{holding.symbol}</Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{holding.quantity} {holding.symbol}</span>
                        <span>Avg: {formatCurrency(holding.averageBuyPrice)}</span>
                        <span>Current: {formatCurrency(performance.currentPrice)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold">
                        {formatCurrency(performance.currentValue)}
                      </span>
                      <div className={`flex items-center gap-1 ${isProfit ? 'text-green-600' : 'text-red-600'}`}>
                        {isProfit ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                        <span className="text-sm">
                          {formatPercentage(performance.gainLossPercent)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(holding)}
                      >
                        <Edit3 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onRemoveHolding(holding.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PortfolioManagement;