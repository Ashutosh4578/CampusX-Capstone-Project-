package com.campus.system.security;
import jakarta.servlet.*; import jakarta.servlet.http.*; import org.springframework.security.authentication.UsernamePasswordAuthenticationToken; import org.springframework.security.core.authority.SimpleGrantedAuthority; import org.springframework.security.core.context.SecurityContextHolder; import org.springframework.stereotype.Component; import org.springframework.web.filter.OncePerRequestFilter; import java.io.IOException; import java.util.List;
@Component public class JwtAuthenticationFilter extends OncePerRequestFilter {
 private final JwtUtil jwtUtil; public JwtAuthenticationFilter(JwtUtil jwtUtil){this.jwtUtil=jwtUtil;}
 @Override protected void doFilterInternal(HttpServletRequest request,HttpServletResponse response,FilterChain chain)throws ServletException,IOException{
  String h=request.getHeader("Authorization"); if(h!=null&&h.startsWith("Bearer ")){String token=h.substring(7); if(jwtUtil.validateToken(token)){String user=jwtUtil.extractUsername(token); String role=jwtUtil.extractRole(token); var auth=new UsernamePasswordAuthenticationToken(user,null,List.of(new SimpleGrantedAuthority("ROLE_"+role))); SecurityContextHolder.getContext().setAuthentication(auth);}}
  chain.doFilter(request,response);
 }
}
