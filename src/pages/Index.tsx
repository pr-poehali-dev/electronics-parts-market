import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

const API_BASE = {
  auth: 'https://functions.poehali.dev/a324fbf0-d9eb-48b1-9249-4b58b1971212',
  products: 'https://functions.poehali.dev/6f61bb3c-833f-45b0-a617-ad3cce752508'
};

interface Product {
  id: number;
  name: string;
  category: string;
  device: string;
  manufacturer: string;
  compatibility: string[];
  price: number;
  image_url?: string;
  in_stock: boolean;
  seller_name?: string;
  description?: string;
}

interface User {
  id: number;
  email: string;
  full_name: string;
  is_seller: boolean;
}

const initialProducts: Product[] = [
  { id: 1, name: 'Дисплей для iPhone 13', category: 'Экраны', device: 'Телефон', manufacturer: 'Apple', compatibility: ['iPhone 13', 'iPhone 13 Pro'], price: 8500, image_url: '/placeholder.svg', in_stock: true },
  { id: 2, name: 'Батарея Samsung Galaxy S21', category: 'Аккумуляторы', device: 'Телефон', manufacturer: 'Samsung', compatibility: ['Galaxy S21', 'Galaxy S21+'], price: 3200, image_url: '/placeholder.svg', in_stock: true },
  { id: 3, name: 'Клавиатура MacBook Pro 16"', category: 'Клавиатуры', device: 'Ноутбук', manufacturer: 'Apple', compatibility: ['MacBook Pro 16" 2021', 'MacBook Pro 16" 2022'], price: 12000, image_url: '/placeholder.svg', in_stock: true },
  { id: 4, name: 'SSD накопитель 512GB', category: 'Накопители', device: 'Ноутбук', manufacturer: 'Samsung', compatibility: ['M.2 NVMe'], price: 5500, image_url: '/placeholder.svg', in_stock: true },
  { id: 5, name: 'Тачскрин iPad Pro 11"', category: 'Экраны', device: 'Планшет', manufacturer: 'Apple', compatibility: ['iPad Pro 11" 2020', 'iPad Pro 11" 2021'], price: 15000, image_url: '/placeholder.svg', in_stock: false },
  { id: 6, name: 'Материнская плата MSI B550', category: 'Материнские платы', device: 'Компьютер', manufacturer: 'MSI', compatibility: ['AMD Ryzen 5000', 'AMD Ryzen 3000'], price: 9800, image_url: '/placeholder.svg', in_stock: true },
  { id: 7, name: 'Ремешок Apple Watch Series 7', category: 'Аксессуары', device: 'Часы', manufacturer: 'Apple', compatibility: ['Apple Watch 7', 'Apple Watch 8'], price: 2500, image_url: '/placeholder.svg', in_stock: true },
  { id: 8, name: 'Амбушюры Sony WH-1000XM4', category: 'Аксессуары', device: 'Наушники', manufacturer: 'Sony', compatibility: ['WH-1000XM4', 'WH-1000XM5'], price: 1200, image_url: '/placeholder.svg', in_stock: true },
  { id: 9, name: 'Дисплей для iPhone 14 Pro', category: 'Экраны', device: 'Телефон', manufacturer: 'Apple', compatibility: ['iPhone 14 Pro'], price: 12000, image_url: '/placeholder.svg', in_stock: true },
  { id: 10, name: 'Батарея Xiaomi Redmi Note 11', category: 'Аккумуляторы', device: 'Телефон', manufacturer: 'Xiaomi', compatibility: ['Redmi Note 11'], price: 1800, image_url: '/placeholder.svg', in_stock: true },
  { id: 11, name: 'Тачпад MacBook Air M2', category: 'Тачпады', device: 'Ноутбук', manufacturer: 'Apple', compatibility: ['MacBook Air M2'], price: 8500, image_url: '/placeholder.svg', in_stock: true },
  { id: 12, name: 'Оперативная память DDR4 16GB', category: 'Память', device: 'Компьютер', manufacturer: 'Kingston', compatibility: ['DDR4 3200MHz'], price: 4500, image_url: '/placeholder.svg', in_stock: true },
  { id: 13, name: 'Задняя крышка Samsung Galaxy S22', category: 'Корпуса', device: 'Телефон', manufacturer: 'Samsung', compatibility: ['Galaxy S22'], price: 2500, image_url: '/placeholder.svg', in_stock: true },
  { id: 14, name: 'Вентилятор для ноутбука Lenovo', category: 'Охлаждение', device: 'Ноутбук', manufacturer: 'Lenovo', compatibility: ['ThinkPad X1'], price: 2200, image_url: '/placeholder.svg', in_stock: true },
  { id: 15, name: 'Динамики для iPad Air 4', category: 'Динамики', device: 'Планшет', manufacturer: 'Apple', compatibility: ['iPad Air 4'], price: 3500, image_url: '/placeholder.svg', in_stock: true },
  { id: 16, name: 'Видеокарта NVIDIA GTX 1660', category: 'Видеокарты', device: 'Компьютер', manufacturer: 'NVIDIA', compatibility: ['PCIe x16'], price: 18000, image_url: '/placeholder.svg', in_stock: true },
  { id: 17, name: 'Ремешок Xiaomi Mi Band 7', category: 'Аксессуары', device: 'Часы', manufacturer: 'Xiaomi', compatibility: ['Mi Band 7'], price: 600, image_url: '/placeholder.svg', in_stock: true },
  { id: 18, name: 'Амбушюры AirPods Pro', category: 'Аксессуары', device: 'Наушники', manufacturer: 'Apple', compatibility: ['AirPods Pro'], price: 800, image_url: '/placeholder.svg', in_stock: true },
  { id: 19, name: 'Камера для iPhone 12', category: 'Камеры', device: 'Телефон', manufacturer: 'Apple', compatibility: ['iPhone 12'], price: 7500, image_url: '/placeholder.svg', in_stock: true },
  { id: 20, name: 'Разъем зарядки USB-C', category: 'Разъемы', device: 'Телефон', manufacturer: 'Универсальный', compatibility: ['Samsung', 'Xiaomi', 'Huawei'], price: 900, image_url: '/placeholder.svg', in_stock: true },
  { id: 21, name: 'HDD 1TB для ноутбука', category: 'Накопители', device: 'Ноутбук', manufacturer: 'Seagate', compatibility: ['SATA 2.5"'], price: 3200, image_url: '/placeholder.svg', in_stock: true },
  { id: 22, name: 'Стекло защитное iPad Mini 6', category: 'Аксессуары', device: 'Планшет', manufacturer: 'Универсальный', compatibility: ['iPad Mini 6'], price: 1200, image_url: '/placeholder.svg', in_stock: true },
  { id: 23, name: 'Блок питания 600W', category: 'Блоки питания', device: 'Компьютер', manufacturer: 'Corsair', compatibility: ['ATX'], price: 5500, image_url: '/placeholder.svg', in_stock: true },
  { id: 24, name: 'Браслет Samsung Galaxy Watch 5', category: 'Аксессуары', device: 'Часы', manufacturer: 'Samsung', compatibility: ['Galaxy Watch 5'], price: 2200, image_url: '/placeholder.svg', in_stock: true },
  { id: 25, name: 'Кабель зарядки Lightning', category: 'Кабели', device: 'Наушники', manufacturer: 'Apple', compatibility: ['AirPods'], price: 1500, image_url: '/placeholder.svg', in_stock: true },
  { id: 26, name: 'Микрофон для iPhone 11', category: 'Микрофоны', device: 'Телефон', manufacturer: 'Apple', compatibility: ['iPhone 11'], price: 1800, image_url: '/placeholder.svg', in_stock: true },
  { id: 27, name: 'Wi-Fi модуль для ноутбука Dell', category: 'Сетевые модули', device: 'Ноутбук', manufacturer: 'Dell', compatibility: ['Dell Inspiron'], price: 2500, image_url: '/placeholder.svg', in_stock: true },
  { id: 28, name: 'Кнопка Power для Samsung Tab S7', category: 'Кнопки', device: 'Планшет', manufacturer: 'Samsung', compatibility: ['Galaxy Tab S7'], price: 800, image_url: '/placeholder.svg', in_stock: true },
  { id: 29, name: 'Процессор Intel Core i5', category: 'Процессоры', device: 'Компьютер', manufacturer: 'Intel', compatibility: ['LGA1200'], price: 15000, image_url: '/placeholder.svg', in_stock: true },
  { id: 30, name: 'Стекло Garmin Fenix 6', category: 'Аксессуары', device: 'Часы', manufacturer: 'Garmin', compatibility: ['Fenix 6'], price: 1800, image_url: '/placeholder.svg', in_stock: true },
];

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDevice, setSelectedDevice] = useState<string>('Все');
  const [selectedManufacturer, setSelectedManufacturer] = useState<string>('Все');
  const [priceRange, setPriceRange] = useState([0, 20000]);
  const [cart, setCart] = useState<{ product: Product; quantity: number }[]>([]);
  const [activeSection, setActiveSection] = useState('catalog');
  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const { toast } = useToast();

  const devices = ['Все', 'Телефон', 'Ноутбук', 'Планшет', 'Компьютер', 'Часы', 'Наушники'];
  const manufacturers = ['Все', 'Apple', 'Samsung', 'MSI', 'Sony', 'Xiaomi', 'Lenovo', 'Dell', 'Kingston', 'NVIDIA', 'Corsair', 'Intel', 'Garmin'];

  useEffect(() => {
    loadProducts();
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const loadProducts = async () => {
    try {
      const response = await fetch(API_BASE.products);
      const data = await response.json();
      if (data.products && data.products.length > 0) {
        setProducts(data.products);
      }
    } catch (error) {
      console.error('Failed to load products:', error);
    }
  };

  const handleAuth = async (action: 'login' | 'register', formData: any) => {
    try {
      const response = await fetch(API_BASE.auth, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, ...formData })
      });
      const data = await response.json();
      
      if (data.success) {
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
        setIsAuthOpen(false);
        toast({
          title: action === 'login' ? 'Вход выполнен' : 'Регистрация успешна',
          description: `Добро пожаловать, ${data.user.full_name}!`
        });
      } else {
        toast({
          title: 'Ошибка',
          description: data.error,
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось подключиться к серверу',
        variant: 'destructive'
      });
    }
  };

  const handleAddProduct = async (productData: any) => {
    try {
      const response = await fetch(API_BASE.products, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...productData, seller_id: user?.id })
      });
      const data = await response.json();
      
      if (data.success) {
        toast({
          title: 'Товар добавлен',
          description: 'Ваш товар успешно опубликован'
        });
        setIsAddProductOpen(false);
        loadProducts();
      } else {
        toast({
          title: 'Ошибка',
          description: data.error,
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось добавить товар',
        variant: 'destructive'
      });
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    toast({
      title: 'Выход выполнен',
      description: 'До встречи!'
    });
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDevice = selectedDevice === 'Все' || product.device === selectedDevice;
    const matchesManufacturer = selectedManufacturer === 'Все' || product.manufacturer === selectedManufacturer;
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];

    return matchesSearch && matchesDevice && matchesManufacturer && matchesPrice;
  });

  const addToCart = (product: Product) => {
    const existingItem = cart.find(item => item.product.id === product.id);
    if (existingItem) {
      setCart(cart.map(item =>
        item.product.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { product, quantity: 1 }]);
    }
    toast({
      title: 'Добавлено в корзину',
      description: product.name
    });
  };

  const removeFromCart = (productId: number) => {
    setCart(cart.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity === 0) {
      removeFromCart(productId);
    } else {
      setCart(cart.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      ));
    }
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon name="Wrench" className="text-primary" size={28} />
              <span className="text-xl font-bold text-primary">ЗапчастиМаркет</span>
            </div>

            <nav className="hidden md:flex items-center gap-6">
              <button onClick={() => setActiveSection('catalog')} className={`text-sm font-medium transition-colors hover:text-primary ${activeSection === 'catalog' ? 'text-primary' : 'text-foreground'}`}>
                Каталог
              </button>
              <button onClick={() => setActiveSection('about')} className={`text-sm font-medium transition-colors hover:text-primary ${activeSection === 'about' ? 'text-primary' : 'text-foreground'}`}>
                О нас
              </button>
              <button onClick={() => setActiveSection('delivery')} className={`text-sm font-medium transition-colors hover:text-primary ${activeSection === 'delivery' ? 'text-primary' : 'text-foreground'}`}>
                Доставка
              </button>
              <button onClick={() => setActiveSection('reviews')} className={`text-sm font-medium transition-colors hover:text-primary ${activeSection === 'reviews' ? 'text-primary' : 'text-foreground'}`}>
                Отзывы
              </button>
              <button onClick={() => setActiveSection('contacts')} className={`text-sm font-medium transition-colors hover:text-primary ${activeSection === 'contacts' ? 'text-primary' : 'text-foreground'}`}>
                Контакты
              </button>
            </nav>

            <div className="flex items-center gap-3">
              {user ? (
                <>
                  {user.is_seller && (
                    <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
                      <DialogTrigger asChild>
                        <Button size="sm">
                          <Icon name="Plus" size={16} className="mr-2" />
                          Добавить товар
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Добавить новый товар</DialogTitle>
                        </DialogHeader>
                        <AddProductForm onSubmit={handleAddProduct} onCancel={() => setIsAddProductOpen(false)} />
                      </DialogContent>
                    </Dialog>
                  )}
                  <Button variant="ghost" size="icon" onClick={logout}>
                    <Icon name="LogOut" size={20} />
                  </Button>
                </>
              ) : (
                <Dialog open={isAuthOpen} onOpenChange={setIsAuthOpen}>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Icon name="User" size={20} />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Вход / Регистрация</DialogTitle>
                    </DialogHeader>
                    <AuthForm onSubmit={handleAuth} />
                  </DialogContent>
                </Dialog>
              )}

              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Icon name="ShoppingCart" size={20} />
                    {cartCount > 0 && (
                      <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-white">
                        {cartCount}
                      </span>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Корзина</SheetTitle>
                  </SheetHeader>
                  <div className="mt-8 space-y-4">
                    {cart.length === 0 ? (
                      <p className="text-center text-muted-foreground">Корзина пуста</p>
                    ) : (
                      <>
                        {cart.map(item => (
                          <div key={item.product.id} className="flex gap-4 border-b pb-4">
                            <img src={item.product.image_url || '/placeholder.svg'} alt={item.product.name} className="h-16 w-16 rounded object-cover" />
                            <div className="flex-1">
                              <p className="text-sm font-medium">{item.product.name}</p>
                              <p className="text-sm text-muted-foreground">{item.product.price} ₽</p>
                              <div className="mt-2 flex items-center gap-2">
                                <Button size="sm" variant="outline" onClick={() => updateQuantity(item.product.id, item.quantity - 1)}>-</Button>
                                <span className="text-sm">{item.quantity}</span>
                                <Button size="sm" variant="outline" onClick={() => updateQuantity(item.product.id, item.quantity + 1)}>+</Button>
                              </div>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.product.id)}>
                              <Icon name="Trash2" size={16} />
                            </Button>
                          </div>
                        ))}
                        <div className="border-t pt-4">
                          <div className="flex justify-between text-lg font-bold">
                            <span>Итого:</span>
                            <span>{cartTotal} ₽</span>
                          </div>
                          <Button className="mt-4 w-full" size="lg">Оформить заказ</Button>
                        </div>
                      </>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      {activeSection === 'catalog' && (
        <main className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="mb-2 text-3xl font-bold">Каталог запчастей</h1>
            <p className="text-muted-foreground">
              Профессиональные запчасти для вашей техники
            </p>
          </div>

          <div className="mb-6 flex gap-4">
            <div className="relative flex-1">
              <Icon name="Search" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
              <Input
                placeholder="Поиск по названию или категории..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
            <aside className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Фильтры</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <label className="mb-2 block text-sm font-medium">Тип устройства</label>
                    <Select value={selectedDevice} onValueChange={setSelectedDevice}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {devices.map(device => (
                          <SelectItem key={device} value={device}>{device}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium">Производитель</label>
                    <Select value={selectedManufacturer} onValueChange={setSelectedManufacturer}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {manufacturers.map(manufacturer => (
                          <SelectItem key={manufacturer} value={manufacturer}>{manufacturer}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Цена: {priceRange[0]} - {priceRange[1]} ₽
                    </label>
                    <Slider min={0} max={20000} step={500} value={priceRange} onValueChange={setPriceRange} className="mt-4" />
                  </div>

                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setSelectedDevice('Все');
                      setSelectedManufacturer('Все');
                      setPriceRange([0, 20000]);
                      setSearchQuery('');
                    }}
                  >
                    Сбросить фильтры
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Категории</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {devices.slice(1).map(device => (
                      <button
                        key={device}
                        onClick={() => setSelectedDevice(device)}
                        className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-muted ${
                          selectedDevice === device ? 'bg-muted font-medium' : ''
                        }`}
                      >
                        <Icon name="ChevronRight" size={16} />
                        {device}
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </aside>

            <div>
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Найдено товаров: {filteredProducts.length}
                </p>
              </div>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredProducts.map(product => (
                  <Card key={product.id} className="overflow-hidden transition-shadow hover:shadow-lg">
                    <CardHeader className="p-0">
                      <img src={product.image_url || '/placeholder.svg'} alt={product.name} className="h-48 w-full object-cover" />
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="mb-2 flex items-start justify-between gap-2">
                        <CardTitle className="text-base">{product.name}</CardTitle>
                        {!product.in_stock && (
                          <Badge variant="secondary">Нет в наличии</Badge>
                        )}
                      </div>
                      <div className="mb-3 space-y-1 text-sm text-muted-foreground">
                        <p className="flex items-center gap-2">
                          <Icon name="Tag" size={14} />
                          {product.category}
                        </p>
                        <p className="flex items-center gap-2">
                          <Icon name="Smartphone" size={14} />
                          {product.device}
                        </p>
                        <p className="flex items-center gap-2">
                          <Icon name="Building" size={14} />
                          {product.manufacturer}
                        </p>
                      </div>
                      {product.compatibility && (
                        <div className="mb-3">
                          <p className="text-xs font-medium text-muted-foreground">Совместимость:</p>
                          <p className="text-xs">{Array.isArray(product.compatibility) ? product.compatibility.join(', ') : product.compatibility}</p>
                        </div>
                      )}
                    </CardContent>
                    <CardFooter className="flex items-center justify-between p-4 pt-0">
                      <span className="text-xl font-bold text-primary">{product.price} ₽</span>
                      <Button onClick={() => addToCart(product)} disabled={!product.in_stock} size="sm">
                        <Icon name="ShoppingCart" size={16} className="mr-2" />
                        В корзину
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </main>
      )}

      {activeSection === 'about' && <AboutSection />}
      {activeSection === 'delivery' && <DeliverySection />}
      {activeSection === 'reviews' && <ReviewsSection />}
      {activeSection === 'contacts' && <ContactsSection />}
    </div>
  );
};

const AuthForm = ({ onSubmit }: { onSubmit: (action: 'login' | 'register', data: any) => void }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ email: '', password: '', full_name: '', phone: '', is_seller: false });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(isLogin ? 'login' : 'register', formData);
  };

  return (
    <Tabs value={isLogin ? 'login' : 'register'} onValueChange={(v) => setIsLogin(v === 'login')}>
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="login">Вход</TabsTrigger>
        <TabsTrigger value="register">Регистрация</TabsTrigger>
      </TabsList>
      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        {!isLogin && (
          <>
            <div>
              <Label htmlFor="full_name">Полное имя</Label>
              <Input id="full_name" value={formData.full_name} onChange={(e) => setFormData({ ...formData, full_name: e.target.value })} required={!isLogin} />
            </div>
            <div>
              <Label htmlFor="phone">Телефон</Label>
              <Input id="phone" type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
            </div>
          </>
        )}
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
        </div>
        <div>
          <Label htmlFor="password">Пароль</Label>
          <Input id="password" type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required />
        </div>
        {!isLogin && (
          <div className="flex items-center space-x-2">
            <Checkbox id="is_seller" checked={formData.is_seller} onCheckedChange={(checked) => setFormData({ ...formData, is_seller: !!checked })} />
            <Label htmlFor="is_seller" className="text-sm">Я хочу продавать запчасти</Label>
          </div>
        )}
        <Button type="submit" className="w-full">{isLogin ? 'Войти' : 'Зарегистрироваться'}</Button>
      </form>
    </Tabs>
  );
};

const AddProductForm = ({ onSubmit, onCancel }: { onSubmit: (data: any) => void; onCancel: () => void }) => {
  const [formData, setFormData] = useState({
    name: '', category: '', device: '', manufacturer: '', compatibility: '', price: '', description: '', image_url: '', in_stock: true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      price: parseInt(formData.price),
      compatibility: formData.compatibility.split(',').map(s => s.trim())
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Название товара</Label>
        <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="category">Категория</Label>
          <Input id="category" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} required />
        </div>
        <div>
          <Label htmlFor="device">Устройство</Label>
          <Select value={formData.device} onValueChange={(value) => setFormData({ ...formData, device: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Выберите" />
            </SelectTrigger>
            <SelectContent>
              {['Телефон', 'Ноутбук', 'Планшет', 'Компьютер', 'Часы', 'Наушники'].map(d => (
                <SelectItem key={d} value={d}>{d}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div>
        <Label htmlFor="manufacturer">Производитель</Label>
        <Input id="manufacturer" value={formData.manufacturer} onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })} required />
      </div>
      <div>
        <Label htmlFor="compatibility">Совместимость (через запятую)</Label>
        <Input id="compatibility" value={formData.compatibility} onChange={(e) => setFormData({ ...formData, compatibility: e.target.value })} placeholder="iPhone 13, iPhone 13 Pro" />
      </div>
      <div>
        <Label htmlFor="price">Цена (₽)</Label>
        <Input id="price" type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} required />
      </div>
      <div>
        <Label htmlFor="description">Описание</Label>
        <Textarea id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} />
      </div>
      <div>
        <Label htmlFor="image_url">URL изображения</Label>
        <Input id="image_url" value={formData.image_url} onChange={(e) => setFormData({ ...formData, image_url: e.target.value })} placeholder="/placeholder.svg" />
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox id="in_stock" checked={formData.in_stock} onCheckedChange={(checked) => setFormData({ ...formData, in_stock: !!checked })} />
        <Label htmlFor="in_stock">В наличии</Label>
      </div>
      <div className="flex gap-3">
        <Button type="submit" className="flex-1">Опубликовать</Button>
        <Button type="button" variant="outline" onClick={onCancel}>Отмена</Button>
      </div>
    </form>
  );
};

const AboutSection = () => (
  <main className="container mx-auto px-4 py-16">
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-6 text-3xl font-bold">О нас</h1>
      <div className="space-y-4 text-muted-foreground">
        <p>ЗапчастиМаркет — профессиональный маркетплейс запчастей для электроники. Мы специализируемся на поставке качественных комплектующих для телефонов, ноутбуков, планшетов, компьютеров, часов и наушников.</p>
        <p>Наша миссия — предоставить надёжные запчасти и аксессуары с гарантией качества. Работаем только с проверенными поставщиками.</p>
      </div>
    </div>
  </main>
);

const DeliverySection = () => (
  <main className="container mx-auto px-4 py-16">
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-6 text-3xl font-bold">Доставка</h1>
      <div className="space-y-4 text-muted-foreground">
        <p>Мы доставляем запчасти по всей России:</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>Курьерская доставка по Москве — 1-2 дня</li>
          <li>Курьерская доставка по регионам — 3-7 дней</li>
          <li>Самовывоз из пунктов выдачи — бесплатно</li>
          <li>Экспресс-доставка — в день заказа</li>
        </ul>
      </div>
    </div>
  </main>
);

const ReviewsSection = () => (
  <main className="container mx-auto px-4 py-16">
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-6 text-3xl font-bold">Отзывы</h1>
      <div className="space-y-6">
        {[1, 2, 3].map(i => (
          <Card key={i}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white">И</div>
                <div>
                  <CardTitle className="text-base">Иван Петров</CardTitle>
                  <p className="text-xs text-muted-foreground">15 декабря 2024</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-2 flex gap-1">
                {[1, 2, 3, 4, 5].map(star => (
                  <Icon key={star} name="Star" size={16} className="fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-sm text-muted-foreground">Отличное качество запчастей! Заказал экран для iPhone, пришёл быстро и хорошо упакован. Всё работает идеально. Рекомендую!</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  </main>
);

const ContactsSection = () => (
  <main className="container mx-auto px-4 py-16">
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-6 text-3xl font-bold">Контакты</h1>
      <div className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Icon name="MapPin" className="text-primary" size={20} />
                <div>
                  <p className="font-medium">Адрес</p>
                  <p className="text-sm text-muted-foreground">г. Москва, ул. Примерная, д. 1</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Icon name="Phone" className="text-primary" size={20} />
                <div>
                  <p className="font-medium">Телефон</p>
                  <p className="text-sm text-muted-foreground">+7 (495) 123-45-67</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Icon name="Mail" className="text-primary" size={20} />
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">info@zapchasti.ru</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Icon name="Clock" className="text-primary" size={20} />
                <div>
                  <p className="font-medium">Время работы</p>
                  <p className="text-sm text-muted-foreground">Пн-Пт: 9:00 - 20:00<br />Сб-Вс: 10:00 - 18:00</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </main>
);

export default Index;
