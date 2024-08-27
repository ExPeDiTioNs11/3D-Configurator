3D Mirror Configurator - Dökümantasyon
Proje Tanımı
3D Mirror Configurator, kullanıcıların ayna boyutlarını, eğimini ve sensör konumunu ayarlanabildiği bir web tabanlı uygulamadır. Bu uygulama, kullanıcıların aynayı sanal ortamda yapılandırmalarına olanak sağlar ve 3D görselleştirme kullanarak kullanıcı etkileşimlerine yanıt verir.
Kullanılan Teknolojiler ve Kütüphaneler
HTML5: Sayfanın yapısını tanımlar. Formlar ve 3D görünüm alanı için HTML elemanlarını içerir.
CSS3: Sayfanın stilini ve düzenini tanımlar. Responsive tasarım için temel stiller ve düzenlemeleri içerir.
JavaScript: Dinamik içerik ve etkileşimleri yönetir.
Three.js: 3D grafikler oluşturmak için kullanılan bir JavaScript kütüphanesidir. Aynanın ve sensörün 3D modellemesini sağlar.
Kurulum ve Yapılandırma
1. HTML
HTML dosyası, kullanıcı arayüzünü oluşturur. Form elemanları, ayarları yapmak için gerekli alanları içerir:
Ayna boyutları (genişlik ve yükseklik)
Ayna eğimi (tilt)
Sensör ekleme seçeneği
Anahtar konumunu seçme
2. CSS
CSS dosyası, sayfanın görünümünü düzenler. Temel stil ayarlarını ve responsive tasarımı içerir:
Genel düzen ve tipografi
Form elemanları ve etiketler
3D görünüm alanı için stil


3. JavaScript
JavaScript dosyası, 3D görselleştirme ve kullanıcı etkileşimlerini yönetir:
Three.js kullanarak 3D sahne oluşturur.
Ayna ve sensörün 3D modelini yapılandırır.
Kullanıcı etkileşimlerini dinler ve sahneyi günceller.
Performans iyileştirmeleri sağlar.
Performans İyileştirmeleri
Memoization: React uygulamasında useMemo ve useCallback kullanarak bileşenlerin gereksiz render edilmesini engeller.
Component Splitting: Bileşenleri küçük parçalara ayırarak daha iyi yönetim ve performans sağlar.
Debouncing: Kullanıcı etkileşimlerinde (örneğin, kaydırıcı hareketi) performansı artırmak için debouncing uygulanır.
Lights Optimization: Three.js sahnesinde birden fazla ışık türü kullanılarak görsel kalitenin artırılması sağlanır. Farklı ışık türleri (ambient, directional, point, spot) sahnede detayları vurgular.
Kullanıcı Etkileşimleri
Ayna Boyutları: Genişlik ve yükseklik girişleri ile aynanın boyutları değiştirilebilir. Değişiklikler, ayna modelinin ölçeklendirilmesini sağlar.
Ayna Eğimi: Kaydırıcı ile eğim açısı ayarlanabilir ve bu eğim aynanın 3D görünümünü etkiler.
Sensör Ekleme: Kullanıcı, sensör ekleyebilir ve sensörün konumunu seçebilir. Sensör, seçilen konuma göre aynada gösterilir.
Anahtar Konumu: Sensör eklendiğinde, anahtarın konumu kullanıcı tarafından seçilir ve bu konum ayna üzerinde gösterilir.





Kod Açıklamaları
HTML
HTML kodu, form elemanları ve 3D görünüm alanını içerir. Ayrıca, Three.js kütüphanesi ve özel JavaScript dosyası bu HTML sayfasında yüklenir.
JavaScript
JavaScript kodu, Three.js ile 3D sahne oluşturur, aynayı ve sensörü yapılandırır, ve kullanıcı etkileşimlerine göre sahneyi günceller.
updateMirrorDimensions: Aynanın boyutlarını günceller ve sensörün konumunu yeniden hesaplar.
handleTiltInput: Aynanın eğimini günceller.
handleSensorVisibility: Sensörün görünürlüğünü ve konumunu ayarlar.
updateSensorPosition: Sensörün ayna üzerindeki konumunu hesaplar ve ayarlar.

