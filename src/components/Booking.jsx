import { useState } from 'react';
import { Calendar, Users, Mail, Phone, User, Send, CheckCircle } from 'lucide-react';
import styles from './Booking.module.css';

export default function Booking() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    checkIn: '',
    checkOut: '',
    guests: '2',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Тук по-нататък ще вържем изпращането към Firebase / EmailJS
    console.log('Booking request sent:', formData);
    setSubmitted(true);
  };

  return (
    <section id="booking" className={styles['booking-section']}>
      <div className={styles['booking-container']}>
        <div className={styles['booking-header']}>
          <h2>Резервация & Запитване</h2>
          <p>Изпратете запитване за желаните от вас дати и ние ще се свържем с вас възможно най-скоро</p>
        </div>

        <div className={styles['booking-grid']}>
          <div className={styles['booking-info']}>
            <h3>Директен контакт</h3>
            <p>Предпочитате бърз разговор или съобщение? Свържете се с нас директно:</p>

            <div className={styles['contact-list']}>
              <a href="tel:+359899990291" className={styles['contact-item']}>
                <div className={styles.icon}><Phone size={20} /></div>
                <div>
                  <span>Телефон</span>
                  <strong>+359 899990291</strong>
                </div>
              </a>

              <a href="mailto:info@mvbrilliant.com" className={styles['contact-item']}>
                <div className={styles.icon}><Mail size={20} /></div>
                <div>
                  <span>Имейл</span>
                  <strong>mizuhar@abv.bg</strong>
                </div>
              </a>
            </div>

            <div className={styles['direct-booking-note']}>
              💡 <strong>Директна резервация:</strong> При резервация през сайта спестявате комисионни такси от платформи за нощувки!
            </div>
          </div>

          <div className={styles['booking-form-wrapper']}>
            {submitted ? (
              <div className={styles['success-message']}>
                <CheckCircle size={48} className={styles['success-icon']} />
                <h3>Благодарим ви за запитването!</h3>
                <p>Ще се свържем с вас в най-кратък срок, за да потвърдим наличността за избраните дати.</p>
                <button onClick={() => setSubmitted(false)} className={styles['btn-reset']}>
                  Ново запитване
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className={styles['booking-form']}>
                <div className={styles['form-group']}>
                  <label htmlFor="name"><User size={16} /> Вашето име</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    placeholder="Иван Иванов"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>

                <div className={styles['form-row']}>
                  <div className={styles['form-group']}>
                    <label htmlFor="email"><Mail size={16} /> Имейл</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      placeholder="example@mail.com"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>

                  <div className={styles['form-group']}>
                    <label htmlFor="phone"><Phone size={16} /> Телефон</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      placeholder="0888 123 456"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className={styles['form-row']}>
                  <div className={styles['form-group']}>
                    <label htmlFor="checkIn"><Calendar size={16} /> Настаняване</label>
                    <input
                      type="date"
                      id="checkIn"
                      name="checkIn"
                      required
                      value={formData.checkIn}
                      onChange={handleChange}
                    />
                  </div>

                  <div className={styles['form-group']}>
                    <label htmlFor="checkOut"><Calendar size={16} /> Напускане</label>
                    <input
                      type="date"
                      id="checkOut"
                      name="checkOut"
                      required
                      value={formData.checkOut}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className={styles['form-group']}>
                  <label htmlFor="guests"><Users size={16} /> Брой гости</label>
                  <select
                    id="guests"
                    name="guests"
                    value={formData.guests}
                    onChange={handleChange}
                  >
                    <option value="1">1 гост</option>
                    <option value="2">2 гости</option>
                    <option value="3">3 гости</option>
                    <option value="4">4 гости</option>
                    <option value="5">5 гости</option>
                  </select>
                </div>

                <div className={styles['form-group']}>
                  <label htmlFor="message">Допълнителна информация / въпроси</label>
                  <textarea
                    id="message"
                    name="message"
                    rows="3"
                    placeholder="Например: час на пристигане, нужда от детско креватче..."
                    value={formData.message}
                    onChange={handleChange}
                  ></textarea>
                </div>

                <button type="submit" className={styles['btn-submit']}>
                  <Send size={18} />
                  <span>Изпрати запитването</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}