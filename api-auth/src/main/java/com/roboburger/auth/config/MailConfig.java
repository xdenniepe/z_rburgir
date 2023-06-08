package com.roboburger.auth.config;

import java.io.IOException;
import java.util.Collections;
import java.util.Properties;

import org.springframework.beans.BeansException;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.context.EnvironmentAware;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.context.support.ResourceBundleMessageSource;
import org.springframework.core.env.Environment;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.spring5.SpringTemplateEngine;
import org.thymeleaf.templatemode.TemplateMode;
import org.thymeleaf.templateresolver.ClassLoaderTemplateResolver;
import org.thymeleaf.templateresolver.ITemplateResolver;

import lombok.extern.log4j.Log4j2;

@Configuration
@Log4j2
@PropertySource("classpath:mail/mailconfig.properties")
public class MailConfig implements ApplicationContextAware, EnvironmentAware{
    public  static final String EMAIL_TEMPLATE_ENCODING = "UTF-8";
    private static final String JAVA_MAIL_FILE          = "classpath:mail/javamail.properties";
    private static final String HOST                    = "mail.server.host";
    private static final String PORT                    = "mail.server.port";
    private static final String PROTOCOL                = "mail.server.protocol";
    private static final String USERNAME                = "mail.server.username";
    private static final String PASSWORD                = "mail.server.password";

  private ApplicationContext applicationContext;
  private Environment env;

@Override
public void setEnvironment(Environment env) {
    this.env = env;
}
@Override
public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
    this.applicationContext = applicationContext;
}

@Bean
public JavaMailSender mailSender() throws IOException {
    final JavaMailSenderImpl mailSender = new JavaMailSenderImpl();

    mailSender.setHost(this.env.getProperty(HOST));
    mailSender.setPort(Integer.parseInt(this.env.getProperty(PORT)));
    mailSender.setProtocol(this.env.getProperty(PROTOCOL));
    mailSender.setUsername(this.env.getProperty(USERNAME));
    mailSender.setPassword(this.env.getProperty(PASSWORD));

    final Properties javaMailProperties = new Properties();
    javaMailProperties.load(this.applicationContext.getResource(JAVA_MAIL_FILE).getInputStream());
    mailSender.setJavaMailProperties(javaMailProperties);

    log.info("USERNAME : {}, PASSWORD: {}, HOST: {}, PORT: {}, PROTOCOL: {}", this.env.getProperty(USERNAME), this.env.getProperty(PASSWORD), this.env.getProperty(HOST), this.env.getProperty(PORT), this.env.getProperty(PROTOCOL));
    return mailSender;
}

@Bean
public ResourceBundleMessageSource emailMessageSource() {
    final ResourceBundleMessageSource messageSource = new ResourceBundleMessageSource();

    messageSource.setBasename("mail/MailMessages");
    return messageSource;
}

@Qualifier("email")
@Bean
public TemplateEngine emailTemplateEngine() {
    final SpringTemplateEngine templateEngine = new SpringTemplateEngine();

    templateEngine.addTemplateResolver(htmlTemplateResolver());
    templateEngine.setTemplateEngineMessageSource(emailMessageSource());
    
    return templateEngine;
}

private ITemplateResolver htmlTemplateResolver() {
    final ClassLoaderTemplateResolver templateResolver = new ClassLoaderTemplateResolver();

    templateResolver.setOrder(Integer.valueOf(2));
    templateResolver.setResolvablePatterns(Collections.singleton("templates/*"));
    templateResolver.setPrefix("mail/");
    templateResolver.setSuffix(".html");
    templateResolver.setTemplateMode(TemplateMode.HTML);
    templateResolver.setCharacterEncoding(EMAIL_TEMPLATE_ENCODING);
    templateResolver.setCacheable(false);

    return templateResolver;
}

}
